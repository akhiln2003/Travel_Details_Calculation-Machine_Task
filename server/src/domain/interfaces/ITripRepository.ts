import { TripEntity } from '../entities/Trip.entity';
import { IBaseRepository } from './IBaseRepository';

export type TripCreationAttributes = Omit<TripEntity, "id" | "createdAt" | "updatedAt">;

export interface ITripRepository extends IBaseRepository<TripEntity, TripCreationAttributes> {
  findByUserId(userId: string, page: number, limit: number): Promise<{ trips: TripEntity[], total: number }>;
  findByIdAndUserId(id: string, userId: string): Promise<TripEntity | null>;
}

