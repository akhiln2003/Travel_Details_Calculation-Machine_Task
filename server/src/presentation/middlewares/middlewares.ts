import { ErrorRequestHandler, RequestHandler } from "express";
import { ApiError } from "../errors/ApiError";
import { ZodError } from "zod";
import { JwtService } from "../../infrastructure/external-services/JwtService";

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError({
        message: "Authentication required. Please provide a valid token.",
        statusCode: 401,
        code: "UNAUTHORIZED",
      });
    }

    const token = authHeader.substring(7);
    const jwtService = new JwtService();

    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new ApiError({
        message: "Server configuration error",
        statusCode: 500,
        code: "INTERNAL_ERROR",
      });
    }

    const decoded = jwtService.verifyToken(token, secret);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(
        new ApiError({
          message: "Invalid or expired token",
          statusCode: 401,
          code: "UNAUTHORIZED",
        })
      );
    }
  }
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const isZodError = err instanceof ZodError;
  const statusCode =
    err instanceof ApiError
      ? err.statusCode
      : isZodError
      ? 400
      : err.statusCode ?? 500;

  const response = {
    success: false,
    error: {
      code: err instanceof ApiError ? err.code : isZodError ? "VALIDATION_ERROR" : err.code ?? "INTERNAL_SERVER_ERROR",
      message:
        err instanceof ApiError
          ? err.message
          : isZodError
          ? "Invalid request data"
          : statusCode === 500
          ? "Something went wrong. Please try again later."
          : err.message ?? "Unexpected error",
      details: err instanceof ApiError ? err.details : isZodError ? err.flatten() : undefined,
    },
  };

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
    (response.error as typeof response.error & { stack?: string }).stack = err.stack;
  }

  res.status(statusCode).json(response);
};