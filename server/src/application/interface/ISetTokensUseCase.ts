import { Response } from "express";

export interface ISetTokensUseCase {
  execute(res: Response, accessToken?: string, refreshToken?: string): void;
}
