import { z } from "zod";
import { TripEntity } from "../../domain/entities/Trip.entity";

const TripStatsDto = z.object({
  totalDistanceMeters: z.number(),
  durationMs: z.number(),
  idleDurationMs: z.number(),
  stoppageDurationMs: z.number(),
  overspeedDurationMs: z.number(),
  overspeedSegments: z.number(),
  averageSpeedKmph: z.number(),
  maxSpeedKmph: z.number(),
});

export const TripResponseDto = z.object({
  id: z.string(),
  user: z.string(),
  name: z.string(),
  sourceFileName: z.string(),
  startedAt: z.date(),
  endedAt: z.date(),
  stats: TripStatsDto,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TripListItemDto = z.object({
    id: z.string(),
    name: z.string(),
    startedAt: z.date(),
    endedAt: z.date(),
    totalDistanceMeters: z.number(),
    averageSpeedKmph: z.number(),
});

export type TripResponseDto = z.infer<typeof TripResponseDto>;
export type TripListItemDto = z.infer<typeof TripListItemDto>;

export class TripMapper {
  static toDto(trip: TripEntity): TripResponseDto {
    return TripResponseDto.parse({
      id: trip.id,
      user: trip.user,
      name: trip.name,
      sourceFileName: trip.sourceFileName,
      startedAt: trip.startedAt,
      endedAt: trip.endedAt,
      stats: trip.stats,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    });
  }

  static toListItemDto(trip: TripEntity): TripListItemDto {
    return TripListItemDto.parse({
      id: trip.id,
      name: trip.name,
      startedAt: trip.startedAt,
      endedAt: trip.endedAt,
      totalDistanceMeters: trip.stats.totalDistanceMeters,
      averageSpeedKmph: trip.stats.averageSpeedKmph,
    });
  }
}
