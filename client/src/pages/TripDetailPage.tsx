import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import { icon, type LatLngExpression, type Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import dayjs from "dayjs";
import { setAuthToken } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { tripApi } from "../lib/api-client";
import type { Trip, GpsPoint } from "../types";
import type { ApiError } from "../types/api";

// Fix Leaflet default icon issue
import L from "leaflet";
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const stopIcon: Icon = icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapBoundsProps {
  points: GpsPoint[];
}

const MapBounds = ({ points }: MapBoundsProps) => {
  const map = useMap();
  
  useEffect(() => {
    if (points.length > 0) {
      const bounds = points.map((p) => [p.latitude, p.longitude] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, points]);

  return null;
};

const formatDuration = (ms: number): string => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) {
    return `${hours}Hr ${minutes} Min${minutes !== 1 ? "s" : ""}`;
  }
  return `${minutes} Min${minutes !== 1 ? "s" : ""}`;
};

const TripDetailPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [points, setPoints] = useState<GpsPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
    if (tripId) {
      fetchTripData();
    }
  }, [tripId, token]);

  const fetchTripData = async () => {
    if (!tripId) return;
    setLoading(true);
    setError(null);
    try {
      const [tripsResponse, pointsResponse] = await Promise.all([
        tripApi.getTrips(),
        tripApi.getTripPoints(tripId),
      ]);

      const foundTrip = tripsResponse.trips.find(
        (t) => (t.id || (t as unknown as { _id: string })._id) === tripId
      );

      if (!foundTrip) {
        setError("Trip not found");
        return;
      }

      setTrip({
        ...foundTrip,
        id: foundTrip.id || (foundTrip as unknown as { _id: string })._id,
      });

      const formattedPoints: GpsPoint[] = pointsResponse.points.map((p) => ({
        ...p,
        id: p.id || (p as unknown as { _id: string })._id,
      }));
      setPoints(formattedPoints);
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.error?.message ||
          apiError.message ||
          "Failed to load trip data"
      );
    } finally {
      setLoading(false);
    }
  };

  const paginatedPoints = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return points.slice(start, end);
  }, [points, currentPage]);

  const totalPages = Math.ceil(points.length / itemsPerPage);

  const mapCoords = useMemo(() => {
    if (points.length === 0) return { normal: [], overspeed: [], idle: [], stop: [] };

    const normal: LatLngExpression[] = [];
    const overspeed: LatLngExpression[][] = [];
    let currentOver: LatLngExpression[] = [];

    points.forEach((p, idx) => {
      const coord: LatLngExpression = [p.latitude, p.longitude];
      if (p.isOverSpeed) {
        currentOver.push(coord);
      } else {
        if (currentOver.length > 0) {
          overspeed.push([...currentOver]);
          currentOver = [];
        }
        normal.push(coord);
      }
      if (idx === points.length - 1 && currentOver.length > 0) {
        overspeed.push(currentOver);
      }
    });

    return {
      normal,
      overspeed,
      idle: points.filter((p) => p.isIdle),
      stop: points.filter((p) => p.isStop),
    };
  }, [points]);

  const center: LatLngExpression =
    points.length > 0
      ? [points[0].latitude, points[0].longitude]
      : [20.5937, 78.9629];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Trip not found"}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-black"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="6" x2="12" y2="12" />
                  <line x1="12" y1="12" x2="16" y2="16" />
                </svg>
                <span className="text-lg font-bold text-black">Speedo</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={trip.name}
                readOnly
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                New
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Legend */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-gray-700">Stopped</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-pink-500"></div>
            <span className="text-gray-700">Idle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
            <span className="text-gray-700">Over speeding</span>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="h-[500px] w-full">
            <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapBounds points={points} />
              {mapCoords.normal.length > 1 && (
                <Polyline
                  positions={mapCoords.normal}
                  pathOptions={{ color: "#2563eb", weight: 4, opacity: 0.9 }}
                />
              )}
              {mapCoords.overspeed.map((seg, i) =>
                seg.length > 1 ? (
                  <Polyline
                    key={`overspeed-${i}`}
                    positions={seg}
                    pathOptions={{ color: "#00bcd4", weight: 5, opacity: 0.9 }}
                  />
                ) : null
              )}
              {mapCoords.idle.map((p) => (
                <Marker key={`idle-${p.id}`} position={[p.latitude, p.longitude]} icon={stopIcon}>
                  <Popup>
                    Idle @ {dayjs(p.recordedAt).format("HH:mm:ss")}
                    <br />
                    Speed: {p.speedKmph.toFixed(1)} km/h
                  </Popup>
                </Marker>
              ))}
              {mapCoords.stop.map((p) => (
                <Marker key={`stop-${p.id}`} position={[p.latitude, p.longitude]} icon={stopIcon}>
                  <Popup>
                    Stopped @ {dayjs(p.recordedAt).format("HH:mm:ss")}
                    <br />
                    Ignition off
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(trip.stats.totalDistanceMeters / 1000).toFixed(0)} KM
            </p>
            <p className="text-sm text-gray-500">Total Distanced Travelled</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatDuration(trip.stats.durationMs)}
            </p>
            <p className="text-sm text-gray-500">Total Travelled Duration</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatDuration(trip.stats.overspeedDurationMs)}
            </p>
            <p className="text-sm text-gray-500">Over Speeding Duration</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatDuration(trip.stats.stoppageDurationMs)}
            </p>
            <p className="text-sm text-gray-500">Stopped Duration</p>
          </div>
        </div>

        {/* GPS Points Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">GPS Points</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Point
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ignition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Speed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPoints.map((point) => (
                  <tr key={point.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dayjs(point.recordedAt).format("HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {point.latitude.toFixed(4)}° N, {point.longitude.toFixed(4)}° W
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          point.ignitionOn
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {point.ignitionOn ? "ON" : "OFF"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {point.speedKmph.toFixed(1)} KM/H
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TripDetailPage;

