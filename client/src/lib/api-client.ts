import api from "./api";
import type {
  LoginResponse,
  SignUpResponse,
  TripsResponse,
  TripByIdResponse,
  TripPointsResponse,
  UploadTripResponse,
  DeleteTripResponse,
  ApiError,
} from "../types/api";
import type { GpsPoint, Trip } from "../types";

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/login", { email, password });
    return response.data;
  },

  signup: async (name: string, email: string, password: string): Promise<SignUpResponse> => {
    const response = await api.post<SignUpResponse>("/signup", { name, email, password });
    return response.data;
  },
};

export const tripApi = {
  getTrips: async (page: number, limit: number): Promise<TripsResponse> => {
    const response = await api.get<TripsResponse & { success: boolean; message: string }>("/trips", { params: { page, limit } });
    const { trips, totalPages, currentPage, totalTrips } = response.data;
    return { trips, totalPages, currentPage, totalTrips };
  },

  getTripById: async (tripId: string): Promise<TripByIdResponse> => {
    const response = await api.get<{ trip: Trip } & { success: boolean; message: string }>(`/trips/${tripId}`);
    return { trip: response.data.trip };
  },

  getTripPoints: async (tripId: string): Promise<TripPointsResponse> => {
    const response = await api.get<{ points: GpsPoint[] } & { success: boolean; message: string }>(`/trips/${tripId}/points`);
    return { points: response.data.points };
  },

  uploadTrip: async (file: File, tripName?: string): Promise<UploadTripResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    if (tripName) {
      formData.append("name", tripName);
    }
    const response = await api.post<{ trip: Trip } & { success: boolean; message: string }>("/trips/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { trip: response.data.trip };
  },

  deleteTrip: async (tripId: string): Promise<DeleteTripResponse> => {
    const response = await api.delete<DeleteTripResponse>(`/trips/${tripId}`);
    return response.data;
  },
};

export type { ApiError };
