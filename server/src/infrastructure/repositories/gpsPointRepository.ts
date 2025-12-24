import mongoose from "mongoose";
import { IGpsPointRepository, GpsPointCreationAttributes } from "../../domain/interfaces/IGpsPointRepository";
import { GpsPointEntity } from "../../domain/entities/GpsPoint.entity";
import { GpsPoint, GpsPointDoc } from "../database/mongodb/schemas/gpsPoint.schema";
import { BaseRepository } from "./BaseRepository";

export class GpsPointRepository extends BaseRepository<GpsPointEntity, GpsPointCreationAttributes, GpsPointDoc> implements IGpsPointRepository {
  constructor() {
    super(GpsPoint);
  }

  protected toEntity(gpsPointDoc: GpsPointDoc): GpsPointEntity {
    return {
      id: gpsPointDoc._id.toString(),
      trip: gpsPointDoc.trip.toString(),
      idx: gpsPointDoc.idx,
      latitude: gpsPointDoc.latitude,
      longitude: gpsPointDoc.longitude,
      recordedAt: gpsPointDoc.recordedAt,
      speedKmph: gpsPointDoc.speedKmph,
      ignitionOn: gpsPointDoc.ignitionOn,
      isIdle: gpsPointDoc.isIdle,
      isStop: gpsPointDoc.isStop,
      isOverSpeed: gpsPointDoc.isOverSpeed,
      createdAt: gpsPointDoc.createdAt,
      updatedAt: gpsPointDoc.updatedAt,
    };
  }

  async create(attributes: GpsPointCreationAttributes): Promise<GpsPointEntity> {
    const pointToInsert = {
      ...attributes,
      trip: new mongoose.Types.ObjectId(attributes.trip)
    };
    const newDoc = new this.model(pointToInsert);
    const savedDoc = await newDoc.save();
    return this.toEntity(savedDoc);
  }

  async createMany(points: GpsPointCreationAttributes[]): Promise<GpsPointEntity[]> {
    const pointsToInsert = points.map(p => ({
      ...p,
      trip: new mongoose.Types.ObjectId(p.trip)
    }));
    const createdPoints = await this.model.insertMany(pointsToInsert);
    return createdPoints.map(doc => this.toEntity(doc));
  }

  async findByTripId(tripId: string): Promise<GpsPointEntity[]> {
    const gpsPointDocs = await this.model.find({ trip: tripId }).sort({ idx: 1 });
    return gpsPointDocs.map(doc => this.toEntity(doc));
  }

  async deleteByTripId(tripId: string): Promise<void> {
    await this.model.deleteMany({ trip: tripId });
  }
}
