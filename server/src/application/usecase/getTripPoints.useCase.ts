import { IGetTripPointsUseCase } from "../interface/IGetTripPointsUseCase";
import { ITripRepository } from "../../domain/interfaces/ITripRepository";
import { IGpsPointRepository } from "../../domain/interfaces/IGpsPointRepository";
import { ApiError } from "../../presentation/errors/ApiError";
import HttpStatusCode from "../../presentation/common/httpStatusCode";
import { GpsPointMapper, GpsPointResponseDto } from "../dto/gpsPoint.dto";

export class GetTripPointsUseCase implements IGetTripPointsUseCase {
  constructor(
    private _tripRepository: ITripRepository,
    private _gpsPointRepository: IGpsPointRepository
  ) {}

  async execute(tripId: string, userId: string): Promise<GpsPointResponseDto[]> {
    // Verify trip exists and belongs to user
    const trip = await this._tripRepository.findByIdAndUserId(tripId, userId);
    if (!trip) {
      throw new ApiError({
        message: "Trip not found",
        statusCode: HttpStatusCode.NotFound,
        code: "NOT_FOUND",
      });
    }

    const points = await this._gpsPointRepository.findByTripId(tripId);
    return points.map(GpsPointMapper.toDto);
  }
}

