import { TripListItemDto } from "../dto/trip.dto";

export interface PaginatedTrips {
    trips: TripListItemDto[];
    totalPages: number;
    currentPage: number;
    totalTrips: number;
}

export interface IGetTripsUseCase {
  execute(userId: string, page: number, limit: number): Promise<PaginatedTrips>;
}

