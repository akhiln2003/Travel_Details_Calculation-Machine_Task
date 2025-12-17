import { GpsPointAttr, GpsPointDoc } from "../../infrastructure/database/mongodb/schemas/gpsPoint.schema";

export interface IGpsPointRepository {
  createMany(points: GpsPointAttr[]): Promise<GpsPointDoc[]>;
  findByTripId(tripId: string): Promise<GpsPointDoc[]>;
  deleteByTripId(tripId: string): Promise<void>;
}

