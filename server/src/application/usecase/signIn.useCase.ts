import { ITokenService } from "../../domain/interfaces/ITokenService";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { ApiError } from "../../presentation/errors/ApiError";
import { ISignInUseCase } from "../interface/ISignInUseCase";
import { IUserResponseDto } from "../interface/IUserResponseDto";
import { Password } from "../services/passwordHash";

export class SignInUseCase implements ISignInUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _jwtService: ITokenService
  ) {}
  async execute(
    email: string,
    password: string,
  ): Promise<{
    user: IUserResponseDto;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      // throw new NotFountError("This email is invalid");
      throw new ApiError({
        message: "Invalid credentials. Please check your email and try again.",
        statusCode: 401,
        code: "NOT_AUTHORIZED",
      });
    }

    if (await Password.compare(password, user.password)) {
      const accessToken = this._jwtService.generateAccessToken(user);
      const refreshToken = this._jwtService.generateRefreshToken(user);

      const userData: IUserResponseDto = {
        id: user.id as string,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt as Date,
        updatedAt: user.updatedAt as Date,
      };
      return {
        user: userData,
        accessToken,
        refreshToken,
      };
    }

    throw new ApiError({
      message: "Invalid credentials. Please check your password and try again.",
      statusCode: 401,
      code: "NOT_AUTHORIZED",
    });
  }
}
