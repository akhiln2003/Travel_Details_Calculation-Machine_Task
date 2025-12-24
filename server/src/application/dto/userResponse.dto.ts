import { z } from "zod";
import { User } from "../../../domain/entities/User.entity";

export const UserResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export type UserResponseDto = z.infer<typeof UserResponseDto>;

interface IUser extends User {
    _id?: string;
}

export class UserMapper {
  static toDto(user: IUser): UserResponseDto {
    if (!user.id && !user._id) {
      throw new Error("User ID is missing");
    }
    return UserResponseDto.parse({
      id: user.id ? user.id : user._id!.toString(),
      name: user.name,
      email: user.email,
    });
  }
}
