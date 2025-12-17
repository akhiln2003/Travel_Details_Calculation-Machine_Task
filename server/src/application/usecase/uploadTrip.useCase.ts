import { IUploadTripUseCase } from "../interface/IUploadTripUseCase";
import { ITripRepository } from "../../domain/interfaces/ITripRepository";
import { IGpsPointRepository } from "../../domain/interfaces/IGpsPointRepository";
import { CsvParserService } from "../services/csvParser.service";
import { TripCalculationService } from "../services/tripCalculation.service";
import { TripDoc } from "../../infrastructure/database/mongodb/schemas/trip.schema";
import { ApiError } from "../../presentation/errors/ApiError";
import mongoose from "mongoose";

export class UploadTripUseCase implements IUploadTripUseCase {
  constructor(
    private _tripRepository: ITripRepository,
    private _gpsPointRepository: IGpsPointRepository,
    private _csvParser: CsvParserService,
    private _tripCalculator: TripCalculationService
  ) {}

  async execute(
    userId: string,
    fileBuffer: Buffer,
    fileName: string,
    tripName?: string
  ): Promise<TripDoc> {
    try {
      // Parse CSV
      const rawGpsData = await this._csvParser.parseGpsCsv(fileBuffer);

      // Process GPS data and calculate statistics
      const { points, stats, startedAt, endedAt } =
        this._tripCalculator.processGpsData(rawGpsData);

      // Create trip
      const tripNameToUse = tripName || `Trip ${new Date().toLocaleDateString()}`;
      const trip = await this._tripRepository.create({
        user: new mongoose.Types.ObjectId(userId),
        name: tripNameToUse,
        sourceFileName: fileName,
        startedAt,
        endedAt,
        stats: {
          totalDistanceMeters: stats.totalDistanceMeters,
          durationMs: stats.durationMs,
          idleDurationMs: stats.idleDurationMs,
          stoppageDurationMs: stats.stoppageDurationMs,
          overspeedDurationMs: stats.overspeedDurationMs,
          overspeedSegments: stats.overspeedSegments,
          averageSpeedKmph: stats.averageSpeedKmph,
          maxSpeedKmph: stats.maxSpeedKmph,
        },
      });

      // Create GPS points
      const gpsPointsToSave = points.map((point) => ({
        trip: trip._id,
        idx: point.idx,
        latitude: point.latitude,
        longitude: point.longitude,
        recordedAt: point.recordedAt,
        speedKmph: point.speedKmph,
        ignitionOn: point.ignitionOn,
        isIdle: point.isIdle,
        isStop: point.isStop,
        isOverSpeed: point.isOverSpeed,
      }));

      // Save GPS points in batches to avoid overwhelming the database
      const batchSize = 1000;
      for (let i = 0; i < gpsPointsToSave.length; i += batchSize) {
        const batch = gpsPointsToSave.slice(i, i + batchSize);
        await this._gpsPointRepository.createMany(batch);
      }

      return trip;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError({
        message: error instanceof Error ? error.message : "Failed to process trip",
        statusCode: 500,
        code: "INTERNAL_ERROR",
      });
    }
  }
}

