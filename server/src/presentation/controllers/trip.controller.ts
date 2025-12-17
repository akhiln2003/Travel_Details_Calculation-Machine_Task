import { NextFunction, Request, Response } from "express";
import { IUploadTripUseCase } from "../../application/interface/IUploadTripUseCase";
import { IGetTripsUseCase } from "../../application/interface/IGetTripsUseCase";
import { IGetTripPointsUseCase } from "../../application/interface/IGetTripPointsUseCase";
import { ApiError } from "../errors/ApiError";

export class TripController {
  constructor(
    private _uploadTripUseCase: IUploadTripUseCase,
    private _getTripsUseCase: IGetTripsUseCase,
    private _getTripPointsUseCase: IGetTripPointsUseCase
  ) {}

  uploadTrip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError({
          message: "Authentication required",
          statusCode: 401,
          code: "UNAUTHORIZED",
        });
      }

      const file = req.file;
      if (!file) {
        throw new ApiError({
          message: "CSV file is required. Please select a valid CSV file to upload.",
          statusCode: 400,
          code: "BAD_REQUEST",
        });
      }

      const tripName = req.body.name as string | undefined;
      const trip = await this._uploadTripUseCase.execute(
        req.user.id,
        file.buffer,
        file.originalname,
        tripName
      );

      res.status(201).json({
        success: true,
        trip,
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
          statusCode: 401,
          code: "UNAUTHORIZED",
        });
      }

      const trips = await this._getTripsUseCase.execute(req.user.id);

      res.status(200).json({
        success: true,
        trips,
        message: "Trips retrieved successfully",
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
          statusCode: 401,
          code: "UNAUTHORIZED",
        });
      }

      const { tripId } = req.params;
      if (!tripId) {
        throw new ApiError({
          message: "Trip ID is required",
          statusCode: 400,
          code: "BAD_REQUEST",
        });
      }

      const points = await this._getTripPointsUseCase.execute(tripId, req.user.id);

      res.status(200).json({
        success: true,
        points,
        message: "GPS points retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

