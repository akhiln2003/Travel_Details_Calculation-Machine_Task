import { Response } from "express";

export interface ITokenData {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export interface ITokenService {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  verifyToken(token: string, secret: string): ITokenData;
  setTokens(res: Response, accessToken?: string, refreshToken?: string): void;
  decode(toke: string): any;
}
