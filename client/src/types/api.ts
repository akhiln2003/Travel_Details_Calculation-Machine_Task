import type { AxiosError } from "axios";
import type { Trip, GpsPoint } from "./index";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface SignUpResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface TripsResponse {
  trips: Trip[];
}

export interface TripPointsResponse {
  points: GpsPoint[];
}

export interface UploadTripResponse {
  trip: Trip;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiError = AxiosError<ApiErrorResponse>;

