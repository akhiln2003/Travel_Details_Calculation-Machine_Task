import { AuthPayload } from "../../../application/usecase/auth.service";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

