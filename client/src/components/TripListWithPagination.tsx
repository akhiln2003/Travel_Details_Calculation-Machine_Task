import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import type { TripListItem } from "../types";
import ConfirmationModal from "./ConfirmationModal";

interface Props {
  trips: TripListItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

const TripListWithPagination = ({
  trips,
  selectedIds,
  onToggle,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  loading,
}: Props) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<TripListItem | null>(null);

  const handleTripClick = (tripId: string) => {
    navigate(`/trip/${tripId}`);
  };

  const openConfirmationModal = (trip: TripListItem) => {
    setTripToDelete(trip);
    setIsModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setTripToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDeletion = () => {
    if (tripToDelete) {
      onDelete(tripToDelete.id);
      closeConfirmationModal();
    }
  };

  if (trips.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">
        No trips yet. Upload a CSV to get started.
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Your Trips</h2>
        </div>

        <div className="divide-y divide-gray-100 relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <div className="px-6 py-3 bg-gray-50 font-semibold text-gray-700">
            <div className="flex items-center">
              <div className="w-12"></div>
              <div className="flex-1">Trips</div>
              <div className="w-20"></div>
            </div>
          </div>
          {trips.map((trip) => {
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
                        openConfirmationModal(trip);
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
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                disabled={loading}
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
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {tripToDelete && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={closeConfirmationModal}
          onConfirm={confirmDeletion}
          title="Delete Trip"
          message={`Are you sure you want to delete "${tripToDelete.name}"? This action cannot be undone.`}
        />
      )}
    </>
  );
};

export default TripListWithPagination;

