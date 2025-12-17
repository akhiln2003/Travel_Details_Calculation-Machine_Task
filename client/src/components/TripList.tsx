import dayjs from "dayjs";
import type { Trip } from "../types";

interface Props {
  trips: Trip[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectActive: (trip: Trip) => void;
  activeId?: string;
}

const TripList = ({ trips, selectedIds, onToggle, onSelectActive, activeId }: Props) => {
  if (!trips.length) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 p-4 text-slate-600">
        No trips yet. Upload a CSV to get started.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Trips</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {trips.map((trip) => {
          const selected = selectedIds.includes(trip.id);
          const active = activeId === trip.id;
          return (
            <div
              key={trip.id}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer ${
                active ? "bg-blue-50" : ""
              }`}
              onClick={() => onSelectActive(trip)}
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggle(trip.id);
                }}
                className="h-4 w-4"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{trip.name}</p>
                <p className="text-xs text-slate-500">
                  {dayjs(trip.startedAt).format("YYYY-MM-DD HH:mm")} →{" "}
                  {dayjs(trip.endedAt).format("HH:mm")}
                </p>
              </div>
              <div className="text-sm font-medium text-slate-700">
                {(trip.stats.totalDistanceMeters / 1000).toFixed(1)} km
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TripList;

