import api from "./api";
import type {
  LoginResponse,
  SignUpResponse,
  TripsResponse,
  TripPointsResponse,
  UploadTripResponse,
  ApiError,
} from "../types/api";

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
  getTrips: async (): Promise<TripsResponse> => {
    const response = await api.get<TripsResponse>("/trips");
    return response.data;
  },

  getTripPoints: async (tripId: string): Promise<TripPointsResponse> => {
    const response = await api.get<TripPointsResponse>(`/trips/${tripId}/points`);
    return response.data;
  },

  uploadTrip: async (file: File, tripName?: string): Promise<UploadTripResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    if (tripName) {
      formData.append("name", tripName);
    }
    const response = await api.post<UploadTripResponse>("/trips/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

export type { ApiError };

