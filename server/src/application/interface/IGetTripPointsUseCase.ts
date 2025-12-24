import { GpsPointResponseDto } from "../dto/gpsPoint.dto";

export interface IGetTripPointsUseCase {
  execute(tripId: string, userId: string): Promise<GpsPointResponseDto[]>;
}

