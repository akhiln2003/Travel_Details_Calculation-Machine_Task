import dayjs from "dayjs";
import type { Trip } from "../types";

const formatDuration = (ms: number) => {
  const mins = Math.floor(ms / 60000);
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs}h ${remMins}m`;
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-slate-50 rounded-lg px-4 py-3">
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="text-lg font-semibold text-slate-900">{value}</p>
  </div>
);

const TripSummary = ({ trip }: { trip: Trip | null }) => {
  if (!trip) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow">
        Select a trip to see details.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 shadow space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{trip.name}</h3>
        <p className="text-sm text-slate-500">
          {dayjs(trip.startedAt).format("YYYY-MM-DD HH:mm")} →{" "}
          {dayjs(trip.endedAt).format("YYYY-MM-DD HH:mm")}
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Distance" value={`${(trip.stats.totalDistanceMeters / 1000).toFixed(2)} km`} />
        <Stat label="Duration" value={formatDuration(trip.stats.durationMs)} />
        <Stat label="Idle" value={formatDuration(trip.stats.idleDurationMs)} />
        <Stat label="Stoppage" value={formatDuration(trip.stats.stoppageDurationMs)} />
        <Stat label="Avg speed" value={`${trip.stats.averageSpeedKmph.toFixed(1)} km/h`} />
        <Stat label="Max speed" value={`${trip.stats.maxSpeedKmph.toFixed(1)} km/h`} />
        <Stat label="Overspeed time" value={formatDuration(trip.stats.overspeedDurationMs)} />
        <Stat label="Overspeed segments" value={`${trip.stats.overspeedSegments}`} />
      </div>
    </div>
  );
};

export default TripSummary;

