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

export interface Trip {
  id: string;
  name: string;
  sourceFileName: string;
  startedAt: string;
  endedAt: string;
  stats: TripStats;
}

export interface GpsPoint {
  id: string;
  latitude: number;
  longitude: number;
  recordedAt: string;
  speedKmph: number;
  ignitionOn: boolean;
  isIdle: boolean;
  isStop: boolean;
  isOverSpeed: boolean;
}

