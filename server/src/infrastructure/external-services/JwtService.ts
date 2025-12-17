import JWT, { SignOptions } from "jsonwebtoken";
import { Response } from "express";
import { User } from "../../domain/entities/User.entity";
import {
  ITokenData,
  ITokenService,
} from "../../domain/interfaces/ITokenService";
import { ApiError } from "../../presentation/errors/ApiError";

export class JwtService implements ITokenService {
  private readonly _accessTokenSecret: string;
  private readonly _refreshTokenSecret: string;

  constructor() {
    this._accessTokenSecret = process.env.JWT_ACCESS_SECRET as string;
    this._refreshTokenSecret = process.env.JWT_REFRESH_SECRET as string;
  }
  generateAccessToken(user: Pick<User, "id" | "email">): string {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const options: SignOptions = {
      expiresIn: "15m",
    };

    return JWT.sign(payload, this._accessTokenSecret, options);
  }

  generateRefreshToken(user: Pick<User, "id" | "email">): string {
    return JWT.sign(
      { id: user.id, email: user.email },
      this._refreshTokenSecret,
      { expiresIn: "7d" }
    );
  }

  verifyToken(token: string, secret: string): ITokenData {
    const decoded = JWT.verify(token, secret);

    if (typeof decoded === "string") {
      throw new ApiError({
        message: "Invalid token payload: expected object but got string",
        statusCode: 400,
        code: "NOT_FOUND",
      });
    }

    return decoded as ITokenData;
  }

  setTokens(res: Response, accessToken?: string, refreshToken?: string): void {
    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    };

    if (accessToken) {
      res.cookie("userAccessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
    }

    if (refreshToken) {
      res.cookie("userRefreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }
  }

  decode(toke: string) {
    return JWT.decode(toke);
  }
}
