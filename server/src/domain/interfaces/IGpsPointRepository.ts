import { GpsPointEntity } from '../entities/GpsPoint.entity';
import { IBaseRepository } from './IBaseRepository';

export type GpsPointCreationAttributes = Omit<GpsPointEntity, "id" | "createdAt" | "updatedAt">;

export interface IGpsPointRepository extends IBaseRepository<GpsPointEntity, GpsPointCreationAttributes> {
  createMany(points: GpsPointCreationAttributes[]): Promise<GpsPointEntity[]>;
  findByTripId(tripId: string): Promise<GpsPointEntity[]>;
  deleteByTripId(tripId: string): Promise<void>;
}

