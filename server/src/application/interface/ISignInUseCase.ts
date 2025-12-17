import { IUserResponseDto } from "./IUserResponseDto";

export interface ISignInUseCase {
  execute(
    email: string,
    password: string,
  ): Promise<
     { user: IUserResponseDto; accessToken: string; refreshToken: string }
   
  >;
}
