import { IGetTripByIdUseCase } from "../interface/IGetTripByIdUseCase";
import { ITripRepository } from "../../domain/interfaces/ITripRepository";
import { ApiError } from "../../presentation/errors/ApiError";
import HttpStatusCode from "../../presentation/common/httpStatusCode";
import {
  TripMapper,
  TripResponseDto,
} from "../dto/trip.dto";

export class GetTripByIdUseCase implements IGetTripByIdUseCase {
  constructor(private _tripRepository: ITripRepository) {}

  async execute(tripId: string, userId: string): Promise<TripResponseDto> {
    const trip = await this._tripRepository.findByIdAndUserId(tripId, userId);
    if (!trip) {
      throw new ApiError({
        message: "Trip not found",
        statusCode: HttpStatusCode.NotFound,
        code: "NOT_FOUND",
      });
    }
    return TripMapper.toDto(trip);
  }
}
