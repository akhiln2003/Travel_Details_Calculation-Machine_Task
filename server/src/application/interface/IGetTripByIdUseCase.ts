import { TripResponseDto } from "../dto/trip.dto";

export interface IGetTripByIdUseCase {
  execute(tripId: string, userId: string): Promise<TripResponseDto>;
}
