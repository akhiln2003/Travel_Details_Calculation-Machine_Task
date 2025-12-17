import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import type { Trip } from "../types";

interface Props {
  trips: Trip[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  itemsPerPage?: number;
}

const TripListWithPagination = ({
  trips,
  selectedIds,
  onToggle,
  onDelete,
  itemsPerPage = 10,
}: Props) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(trips.length / itemsPerPage);
  const paginatedTrips = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return trips.slice(start, end);
  }, [trips, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleTripClick = (tripId: string) => {
    navigate(`/trip/${tripId}`);
  };

  if (trips.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">
        No trips yet. Upload a CSV to get started.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Your Trips</h2>
      </div>

      <div className="divide-y divide-gray-100">
        <div className="px-6 py-3 bg-gray-50 font-semibold text-gray-700">
          <div className="flex items-center">
            <div className="w-12"></div>
            <div className="flex-1">Trips</div>
            <div className="w-20"></div>
          </div>
        </div>
        {paginatedTrips.map((trip) => {
          const isSelected = selectedIds.includes(trip.id);
          return (
            <div
              key={trip.id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggle(trip.id);
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-4"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {trip.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {dayjs(trip.startedAt).format("YYYY-MM-DD HH:mm")} →{" "}
                    {dayjs(trip.endedAt).format("HH:mm")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete "${trip.name}"? This action cannot be undone.`)) {
                        onDelete(trip.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete trip"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleTripClick(trip.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View trip details"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
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
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default TripListWithPagination;

