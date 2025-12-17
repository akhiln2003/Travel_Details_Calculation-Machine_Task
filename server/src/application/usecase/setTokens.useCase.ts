import { Response } from "express";
import { ISetTokensUseCase } from "../interface/ISetTokensUseCase";
import { ITokenService } from "../../domain/interfaces/ITokenService";

export class SetTokensUseCase implements ISetTokensUseCase {
  constructor(private _jwtService: ITokenService) {}
  execute(res: Response, accessToken?: string, refreshToken?: string): void {
    this._jwtService.setTokens(res, accessToken, refreshToken);
  }
}
