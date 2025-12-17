import { IGpsPointRepository } from "../../domain/interfaces/IGpsPointRepository";
import { GpsPoint, GpsPointAttr, GpsPointDoc } from "../database/mongodb/schemas/gpsPoint.schema";

export class GpsPointRepository implements IGpsPointRepository {
  async createMany(points: GpsPointAttr[]): Promise<GpsPointDoc[]> {
    return await GpsPoint.insertMany(points);
  }

  async findByTripId(tripId: string): Promise<GpsPointDoc[]> {
    return await GpsPoint.find({ trip: tripId }).sort({ idx: 1 });
  }

  async deleteByTripId(tripId: string): Promise<void> {
    await GpsPoint.deleteMany({ trip: tripId });
  }
}

