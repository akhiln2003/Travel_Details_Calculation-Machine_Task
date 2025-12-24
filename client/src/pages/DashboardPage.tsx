import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { tripApi } from "../lib/api-client";
import type { TripListItem } from "../types";
import type { ApiError } from "../types/api";
import DashboardHeader from "../components/DashboardHeader";
import UploadTripCard from "../components/UploadTripCard";
import UploadTripModal from "../components/UploadTripModal";
import TripListWithPagination from "../components/TripListWithPagination";

const DashboardPage = () => {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<TripListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      fetchTrips(currentPage);
    } else {
      navigate("/login");
    }
  }, [token, navigate, currentPage]);

  const fetchTrips = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tripApi.getTrips(page, itemsPerPage);
      setTrips(response.trips);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      setError(
        apiError.response?.data?.error?.message ||
          apiError.message ||
          "Failed to load trips. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await tripApi.deleteTrip(id);
      // Refetch current page
      // A bit tricky if it was the last item on a page
      if (trips.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchTrips(currentPage);
      }
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.error?.message ||
          apiError.message ||
          "Failed to delete trip"
      );
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  const handleUploaded = () => {
    // Go to first page to see the new upload if it's not already there
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchTrips(1);
    }
  };

  if (loading && trips.length === 0) { // Show full page loader only on initial load
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userName={user?.email || "User"} onLogout={logout} />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UploadTripCard onUploadClick={() => setIsUploadModalOpen(true)} />
          <TripListWithPagination
            trips={trips}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </main>

      <UploadTripModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploaded={handleUploaded}
      />
    </div>
  );
};

export default DashboardPage;
