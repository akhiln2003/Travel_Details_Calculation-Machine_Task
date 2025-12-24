import { UserResponseDto } from "../dto/userResponse.dto";

export interface ISignInUseCase {
  execute(
    email: string,
    password: string,
  ): Promise<
     { user: UserResponseDto; accessToken: string; refreshToken: string }
   
  >;
}
