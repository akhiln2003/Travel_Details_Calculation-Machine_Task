export interface TripStats {
  totalDistanceMeters: number;
  durationMs: number;
  idleDurationMs: number;
  stoppageDurationMs: number;
  overspeedDurationMs: number;
  overspeedSegments: number;
  averageSpeedKmph: number;
  maxSpeedKmph: number;
}

export interface TripEntity {
  id: string;
  user: string;
  name: string;
  sourceFileName: string;
  startedAt: Date;
  endedAt: Date;
  stats: TripStats;
  createdAt: Date;
  updatedAt: Date;
}
