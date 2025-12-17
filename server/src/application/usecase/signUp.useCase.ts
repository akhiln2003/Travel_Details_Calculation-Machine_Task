import { ITokenService } from "../../domain/interfaces/ITokenService";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { ApiError } from "../../presentation/errors/ApiError";
import { ISignUpUseCase } from "../interface/ISignUpUseCase";
import { IUserResponseDto } from "../interface/IUserResponseDto";
import { Password } from "../services/passwordHash";

export class SignUpUseCase implements ISignUpUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _jwtservice: ITokenService
  ) {}

  async execute({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }): Promise<{
    user: IUserResponseDto;
    accessToken: string;
    refreshToken: string;
  }> {
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError({
        message: "User with this email already exists",
        statusCode: 400,
        code: "USER_ALREADY_EXISTS",
      });
    } else {
      const hashPassword = (await Password.toHash(password)) as string;

      const newUser = await this._userRepository.create({
        email,
        name,
        password: hashPassword,
      });

      const accessToken = this._jwtservice.generateAccessToken(newUser);
      const refreshToken = this._jwtservice.generateRefreshToken(newUser);
      const user: IUserResponseDto = {
        id: newUser.id as string,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt as Date,
        updatedAt: newUser.updatedAt as Date,
      };

      return { user, accessToken, refreshToken };
    }
  }
}
