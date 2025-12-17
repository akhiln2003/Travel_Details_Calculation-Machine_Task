import { IUserResponseDto } from "./IUserResponseDto";

export interface ISignUpUseCase {
  execute({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }): Promise<{ user: IUserResponseDto; accessToken: string; refreshToken: string }>;
}
