import { IGetTripPointsUseCase } from "../interface/IGetTripPointsUseCase";
import { ITripRepository } from "../../domain/interfaces/ITripRepository";
import { IGpsPointRepository } from "../../domain/interfaces/IGpsPointRepository";
import { GpsPointDoc } from "../../infrastructure/database/mongodb/schemas/gpsPoint.schema";
import { ApiError } from "../../presentation/errors/ApiError";

export class GetTripPointsUseCase implements IGetTripPointsUseCase {
  constructor(
    private _tripRepository: ITripRepository,
    private _gpsPointRepository: IGpsPointRepository
  ) {}

  async execute(tripId: string, userId: string): Promise<GpsPointDoc[]> {
    // Verify trip exists and belongs to user
    const trip = await this._tripRepository.findByIdAndUserId(tripId, userId);
    if (!trip) {
      throw new ApiError({
        message: "Trip not found",
        statusCode: 404,
        code: "NOT_FOUND",
      });
    }

    return await this._gpsPointRepository.findByTripId(tripId);
  }
}

