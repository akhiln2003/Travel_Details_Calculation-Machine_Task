import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/ApiError";
import { ISignUpUseCase } from "../../application/interface/ISignUpUseCase";
import { ISetTokensUseCase } from "../../application/interface/ISetTokensUseCase";
import HttpStatusCode from "../common/httpStatusCode";

export class SignUpController {
  constructor(
    private _signUpUseCase: ISignUpUseCase,
    private _setTokensUseCase: ISetTokensUseCase
  ) {}
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        throw new ApiError({
          message: "Email, Name and Password are required",
          statusCode: HttpStatusCode.BadRequest,
          code: "BAD_REQUEST",
        });
      }

      const responseData = await this._signUpUseCase.execute({
        email,
        name,
        password,
      });

      this._setTokensUseCase.execute(
        res,
        responseData.accessToken as string,
        responseData.refreshToken as string
      );

      res.status(HttpStatusCode.OK).json({
        token: responseData.accessToken,
        user: responseData.user,
      });
    } catch (error) {
      next(error);
    }
  };
}
