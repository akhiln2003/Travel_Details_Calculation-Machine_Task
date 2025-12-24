import { NextFunction, Request, Response } from "express";
import { ISetTokensUseCase } from "../../application/interface/ISetTokensUseCase";
import { ApiError } from "../errors/ApiError";
import { ISignInUseCase } from "../../application/interface/ISignInUseCase";
import HttpStatusCode from "../common/httpStatusCode";

export class SignInController {
  constructor(
    private _signInUserUseCase: ISignInUseCase,
    private _setTokensUseCase: ISetTokensUseCase
  ) {}

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        throw new ApiError({
          message: "Email and Password are required",
          statusCode: HttpStatusCode.BadRequest,
          code: "BAD_REQUEST",
        });
      }
      const result = await this._signInUserUseCase.execute(email, password);

      this._setTokensUseCase.execute(res, result.accessToken, result.refreshToken);

      res.status(HttpStatusCode.OK).json({
        token: result.accessToken,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  };
}
