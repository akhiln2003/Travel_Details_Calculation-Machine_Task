import { TripResponseDto } from "../dto/trip.dto";

export interface IUploadTripUseCase {
  execute(
    userId: string,
    fileBuffer: Buffer,
    fileName:string,
    tripName?: string
  ): Promise<TripResponseDto>;
}

