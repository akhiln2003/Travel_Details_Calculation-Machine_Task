import { UserResponseDto } from "../dto/userResponse.dto";

export interface ISignUpUseCase {
  execute({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }): Promise<{ user: UserResponseDto; accessToken: string; refreshToken: string }>;
}
