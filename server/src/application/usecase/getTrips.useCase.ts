import { IGetTripsUseCase } from "../interface/IGetTripsUseCase";
import { ITripRepository } from "../../domain/interfaces/ITripRepository";
import { TripDoc } from "../../infrastructure/database/mongodb/schemas/trip.schema";

export class GetTripsUseCase implements IGetTripsUseCase {
  constructor(private _tripRepository: ITripRepository) {}

  async execute(userId: string): Promise<TripDoc[]> {
    return await this._tripRepository.findByUserId(userId);
  }
}

