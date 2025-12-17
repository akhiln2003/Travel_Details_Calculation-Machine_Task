import { User } from "../../domain/entities/User.entity";
import { Auth } from "../database";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";

export class UserRepository implements IUserRepository {
  // creating and save new verified user
  async create(user: User): Promise<User> {
    const newUser = Auth.build(user);
    const newData = await newUser.save();
    return newData;
  }

  // find user by ther emailId
  async findByEmail(email: string): Promise<User | null> {
    
    const data = await Auth.findOne({ email });

    if (!data) return null;

    return data;
  }
}
