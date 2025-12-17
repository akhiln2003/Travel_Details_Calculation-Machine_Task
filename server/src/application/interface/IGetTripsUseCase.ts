import { TripDoc } from "../../infrastructure/database/mongodb/schemas/trip.schema";

export interface IGetTripsUseCase {
  execute(userId: string): Promise<TripDoc[]>;
}

