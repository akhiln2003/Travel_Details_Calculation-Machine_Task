import { Document } from "mongoose";

export interface IBaseRepository<TEntity, TCreationAttributes> {
  create(attributes: TCreationAttributes): Promise<TEntity>;
  findById(id: string): Promise<TEntity | null>;
  findAll(page?: number, limit?: number): Promise<{ entities: TEntity[], total: number }>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
