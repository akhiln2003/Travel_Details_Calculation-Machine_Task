import { ITripRepository } from "../../domain/interfaces/ITripRepository";
import { Trip, TripAttr, TripDoc } from "../database/mongodb/schemas/trip.schema";
import { GpsPoint } from "../database/mongodb/schemas/gpsPoint.schema";

export class TripRepository implements ITripRepository {
  async create(trip: TripAttr): Promise<TripDoc> {
    const newTrip = Trip.build(trip);
    return await newTrip.save();
  }

  async findById(id: string): Promise<TripDoc | null> {
    return await Trip.findById(id);
  }

  async findByUserId(userId: string): Promise<TripDoc[]> {
    return await Trip.find({ user: userId }).sort({ createdAt: -1 });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<TripDoc | null> {
    return await Trip.findOne({ _id: id, user: userId });
  }

  async delete(id: string): Promise<void> {
    await GpsPoint.deleteMany({ trip: id });
    await Trip.findByIdAndDelete(id);
  }
}

