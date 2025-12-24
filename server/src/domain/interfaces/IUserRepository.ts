import { User } from "../entities/User.entity";
import { IBaseRepository } from "./IBaseRepository";

export type UserCreationAttributes = Omit<User, "id" | "createdAt" | "updatedAt">;

export interface IUserRepository extends IBaseRepository<User, UserCreationAttributes> {
  findByEmail(email: string): Promise<User | null>;
}
