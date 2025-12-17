import { TripDoc } from "../../infrastructure/database/mongodb/schemas/trip.schema";

export interface IUploadTripUseCase {
  execute(
    userId: string,
    fileBuffer: Buffer,
    fileName: string,
    tripName?: string
  ): Promise<TripDoc>;
}

