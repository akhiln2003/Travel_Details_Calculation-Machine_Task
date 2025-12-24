import { ITokenService } from "../../domain/interfaces/ITokenService";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import HttpStatusCode from "../../presentation/common/httpStatusCode";
import { ApiError } from "../../presentation/errors/ApiError";
import { UserMapper, UserResponseDto } from "../dto/userResponse.dto";
import { ISignUpUseCase } from "../interface/ISignUpUseCase";
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
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
  }> {
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError({
        message: "User with this email already exists",
        statusCode: HttpStatusCode.BadRequest,
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
      const user: UserResponseDto = UserMapper.toDto(newUser as any);

      return { user, accessToken, refreshToken };
    }
  }
}
