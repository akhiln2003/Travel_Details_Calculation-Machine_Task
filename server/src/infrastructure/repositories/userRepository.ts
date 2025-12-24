import { User } from "../../domain/entities/User.entity";
import { IUserRepository, UserCreationAttributes } from "../../domain/interfaces/IUserRepository";
import { BaseRepository } from "./BaseRepository";
import { Auth, AuthDoc } from "../database/mongodb/schemas/user.schema";

export class UserRepository extends BaseRepository<User, UserCreationAttributes, AuthDoc> implements IUserRepository {
  constructor() {
    super(Auth);
  }

  protected toEntity(authDoc: AuthDoc): User {
    return new User(
      authDoc.name,
      authDoc.email,
      authDoc.password,
      authDoc.id,
      authDoc.createdAt,
      authDoc.updatedAt
    );
  }

  async create(userAttrs: UserCreationAttributes): Promise<User> {
    const newUserDoc = Auth.build(userAttrs);
    const savedUserDoc = await newUserDoc.save();
    return this.toEntity(savedUserDoc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.model.findOne({ email });

    if (!data) return null;

    return this.toEntity(data);
  }
}
