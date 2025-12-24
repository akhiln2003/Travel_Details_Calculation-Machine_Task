import mongoose, { Document, Model } from "mongoose";
import { IBaseRepository } from "../../domain/interfaces/IBaseRepository";

export abstract class BaseRepository<TEntity, TCreationAttributes, TDoc extends Document> implements IBaseRepository<TEntity, TCreationAttributes> {
  protected model: Model<TDoc>;

  constructor(model: Model<TDoc>) {
    this.model = model;
  }

  protected abstract toEntity(doc: TDoc): TEntity;

  async create(attributes: TCreationAttributes): Promise<TEntity> {
   
    const newDoc = new this.model(attributes); 
    const savedDoc = await newDoc.save();
    return this.toEntity(savedDoc);
  }

  async findById(id: string): Promise<TEntity | null> {
    const doc = await this.model.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ entities: TEntity[], total: number }> {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      this.model.find().skip(skip).limit(limit),
      this.model.countDocuments(),
    ]);
    const entities = docs.map((doc) => this.toEntity(doc));
    return { entities, total };
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.model.countDocuments({ _id: id });
    return count > 0;
  }
}
