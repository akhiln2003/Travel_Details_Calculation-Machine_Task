import { z } from "zod";
import { GpsPointEntity } from "../../domain/entities/GpsPoint.entity";

export const GpsPointResponseDto = z.object({
  id: z.string(),
  trip: z.string(),
  idx: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  recordedAt: z.date(),
  speedKmph: z.number(),
  ignitionOn: z.boolean(),
  isIdle: z.boolean(),
  isStop: z.boolean(),
  isOverSpeed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type GpsPointResponseDto = z.infer<typeof GpsPointResponseDto>;

export class GpsPointMapper {
  static toDto(point: GpsPointEntity): GpsPointResponseDto {
    return GpsPointResponseDto.parse({
      id: point.id,
      trip: point.trip,
      idx: point.idx,
      latitude: point.latitude,
      longitude: point.longitude,
      recordedAt: point.recordedAt,
      speedKmph: point.speedKmph,
      ignitionOn: point.ignitionOn,
      isIdle: point.isIdle,
      isStop: point.isStop,
      isOverSpeed: point.isOverSpeed,
      createdAt: point.createdAt,
      updatedAt: point.updatedAt,
    });
  }
}
