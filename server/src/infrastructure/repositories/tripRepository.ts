import mongoose from "mongoose";
import { ITripRepository, TripCreationAttributes } from "../../domain/interfaces/ITripRepository";
import { TripEntity } from "../../domain/entities/Trip.entity";
import { Trip, TripDoc } from "../database/mongodb/schemas/trip.schema";
import { GpsPoint } from "../database/mongodb/schemas/gpsPoint.schema";
import { BaseRepository } from "./BaseRepository";

export class TripRepository extends BaseRepository<TripEntity, TripCreationAttributes, TripDoc> implements ITripRepository {
  constructor() {
    super(Trip);
  }

  protected toEntity(tripDoc: TripDoc): TripEntity {
    return {
      id: tripDoc.id,
      user: tripDoc.user.toString(),
      name: tripDoc.name,
      sourceFileName: tripDoc.sourceFileName,
      startedAt: tripDoc.startedAt,
      endedAt: tripDoc.endedAt,
      stats: tripDoc.stats,
      createdAt: tripDoc.createdAt,
      updatedAt: tripDoc.updatedAt,
    };
  }

  async create(trip: TripCreationAttributes): Promise<TripEntity> {
    const tripAttr = {
        name: trip.name,
        sourceFileName: trip.sourceFileName,
        startedAt: trip.startedAt,
        endedAt: trip.endedAt,
        stats: trip.stats,
        user: new mongoose.Types.ObjectId(trip.user)
    };
    const newTrip = new this.model(tripAttr);
    const savedTrip = await newTrip.save();
    return this.toEntity(savedTrip);
  }

  async findByUserId(userId: string, page: number, limit: number): Promise<{ trips: TripEntity[], total: number }> {
    const skip = (page - 1) * limit;
    const [tripDocs, total] = await Promise.all([
      this.model.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments({ user: userId })
    ]);
    const trips = tripDocs.map((doc) => this.toEntity(doc));
    return { trips, total };
  }

  async findByIdAndUserId(id: string, userId: string): Promise<TripEntity | null> {
    const tripDoc = await this.model.findOne({ _id: id, user: userId });
    return tripDoc ? this.toEntity(tripDoc) : null;
  }

  async delete(id: string): Promise<void> {
    await GpsPoint.deleteMany({ trip: id });
    await super.delete(id);
  }
}

