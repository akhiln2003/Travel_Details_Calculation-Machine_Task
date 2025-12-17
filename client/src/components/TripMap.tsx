import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { icon, type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GpsPoint, Trip } from "../types";

const stopIcon = icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Props {
  selectedTrips: Array<{ trip: Trip; points: GpsPoint[] }>;
}

const TripMap = ({ selectedTrips }: Props) => {
  const firstPoint = selectedTrips[0]?.points[0];
  const center: LatLngExpression = firstPoint
    ? [firstPoint.latitude, firstPoint.longitude]
    : [20.5937, 78.9629]; // India center fallback

  return (
    <div className="h-[520px] w-full rounded-xl overflow-hidden border border-slate-100 shadow">
      <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedTrips.map(({ trip, points }) => {
          if (!points.length) return null;

          const normalCoords: LatLngExpression[] = [];
          const overspeedSegments: LatLngExpression[][] = [];
          let currentOver: LatLngExpression[] = [];

          points.forEach((p, idx) => {
            const coord: LatLngExpression = [p.latitude, p.longitude];
            if (p.isOverSpeed) {
              currentOver.push(coord);
            } else {
              if (currentOver.length) {
                overspeedSegments.push(currentOver);
                currentOver = [];
              }
              normalCoords.push(coord);
            }
            // flush at end
            if (idx === points.length - 1 && currentOver.length) {
              overspeedSegments.push(currentOver);
            }
          });

          const idlePoints = points.filter((p) => p.isIdle);
          const stopPoints = points.filter((p) => p.isStop);

          return (
            <div key={trip.id}>
              {normalCoords.length >= 2 && (
                <Polyline positions={normalCoords} pathOptions={{ color: "#2563eb", weight: 4, opacity: 0.9 }} />
              )}
              {overspeedSegments.map((seg, i) =>
                seg.length >= 2 ? (
                  <Polyline
                    key={`${trip.id}-over-${i}`}
                    positions={seg}
                    pathOptions={{ color: "#00bcd4", weight: 5, opacity: 0.9 }}
                  />
                ) : null
              )}
              {idlePoints.map((p) => (
                <Marker position={[p.latitude, p.longitude]} key={`${trip.id}-idle-${p.id}`} icon={stopIcon}>
                  <Popup>
                    Idle @ {new Date(p.recordedAt).toLocaleTimeString()} <br />
                    Speed: {p.speedKmph.toFixed(1)} km/h
                  </Popup>
                </Marker>
              ))}
              {stopPoints.map((p) => (
                <Marker position={[p.latitude, p.longitude]} key={`${trip.id}-stop-${p.id}`} icon={stopIcon}>
                  <Popup>
                    Stoppage @ {new Date(p.recordedAt).toLocaleTimeString()} <br />
                    Ignition off
                  </Popup>
                </Marker>
              ))}
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default TripMap;

