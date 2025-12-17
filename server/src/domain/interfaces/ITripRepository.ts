import { Trip, TripAttr, TripDoc } from "../../infrastructure/database/mongodb/schemas/trip.schema";

export interface ITripRepository {
  create(trip: TripAttr): Promise<TripDoc>;
  findById(id: string): Promise<TripDoc | null>;
  findByUserId(userId: string): Promise<TripDoc[]>;
  findByIdAndUserId(id: string, userId: string): Promise<TripDoc | null>;
  delete(id: string): Promise<void>;
}

