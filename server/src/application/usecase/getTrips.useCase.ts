import { IGetTripsUseCase, PaginatedTrips } from "../interface/IGetTripsUseCase";
import { ITripRepository } from "../../domain/interfaces/ITripRepository";
import { TripMapper } from "../dto/trip.dto";

export class GetTripsUseCase implements IGetTripsUseCase {
  constructor(private _tripRepository: ITripRepository) {}

  async execute(userId: string, page: number, limit: number): Promise<PaginatedTrips> {
    const { trips, total } = await this._tripRepository.findByUserId(userId, page, limit);
    const totalPages = Math.ceil(total / limit);

    return {
      trips: trips.map(TripMapper.toListItemDto),
      totalPages,
      currentPage: page,
      totalTrips: total
    };
  }
}

