import { NextFunction, Request, Response } from "express";
import { IUploadTripUseCase } from "../../application/interface/IUploadTripUseCase";
import { IGetTripsUseCase } from "../../application/interface/IGetTripsUseCase";
import { IGetTripPointsUseCase } from "../../application/interface/IGetTripPointsUseCase";
import { IDeleteTripUseCase } from "../../application/interface/IDeleteTripUseCase";
import { IGetTripByIdUseCase } from "../../application/interface/IGetTripByIdUseCase";
import { ApiError } from "../errors/ApiError";
import HttpStatusCode from "../common/httpStatusCode";

export class TripController {
  constructor(
    private _uploadTripUseCase: IUploadTripUseCase,
    private _getTripsUseCase: IGetTripsUseCase,
    private _getTripByIdUseCase: IGetTripByIdUseCase,
    private _getTripPointsUseCase: IGetTripPointsUseCase,
    private _deleteTripUseCase: IDeleteTripUseCase
  ) {}

  uploadTrip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError({
          message: "Authentication required",
          statusCode: HttpStatusCode.Unauthorized,
          code: "UNAUTHORIZED",
        });
      }

      const file = req.file;
      if (!file) {
        throw new ApiError({
          message: "CSV file is required. Please select a valid CSV file to upload.",
          statusCode: HttpStatusCode.BadRequest,
          code: "BAD_REQUEST",
        });
      }

      const tripName = req.body.name as string | undefined;
      const tripDto = await this._uploadTripUseCase.execute(
        req.user.id,
        file.buffer,
        file.originalname,
        tripName
      );

      res.status(201).json({
        success: true,
        trip: tripDto,
        message: "Trip uploaded and processed successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getTrips = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError({
          message: "Authentication required",
          statusCode: HttpStatusCode.Unauthorized,
          code: "UNAUTHORIZED",
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const paginatedTrips = await this._getTripsUseCase.execute(req.user.id, page, limit);

      res.status(200).json({
        success: true,
        ...paginatedTrips,
        message: "Trips retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getTripById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError({
          message: "Authentication required",
          statusCode: HttpStatusCode.Unauthorized,
          code: "UNAUTHORIZED",
        });
      }

      const { tripId } = req.params;
      if (!tripId) {
        throw new ApiError({
          message: "Trip ID is required",
          statusCode: HttpStatusCode.BadRequest,
          code: "BAD_REQUEST",
        });
      }

      const tripDto = await this._getTripByIdUseCase.execute(tripId, req.user.id);
      res.status(HttpStatusCode.OK).json({
        success: true,
        trip: tripDto,
        message: "Trip retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getTripPoints = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError({
          message: "Authentication required",
          statusCode: HttpStatusCode.Unauthorized,
          code: "UNAUTHORIZED",
        });
      }

      const { tripId } = req.params;
      if (!tripId) {
        throw new ApiError({
          message: "Trip ID is required",
          statusCode: HttpStatusCode.BadRequest,
          code: "BAD_REQUEST",
        });
      }

      const pointDtos = await this._getTripPointsUseCase.execute(tripId, req.user.id);

      res.status(HttpStatusCode.OK).json({
        success: true,
        points: pointDtos,
        message: "GPS points retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  deleteTrip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError({
          message: "Authentication required",
          statusCode: HttpStatusCode.Unauthorized,
          code: "UNAUTHORIZED",
        });
      }

      const { tripId } = req.params;
      if (!tripId) {
        throw new ApiError({
          message: "Trip ID is required",
          statusCode: HttpStatusCode.BadRequest,
          code: "BAD_REQUEST",
        });
      }

      await this._deleteTripUseCase.execute(tripId);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Trip deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
