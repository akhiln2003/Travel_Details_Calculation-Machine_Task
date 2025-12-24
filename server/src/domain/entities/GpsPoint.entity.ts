export interface GpsPointEntity {
  id: string;
  trip: string;
  idx: number;
  latitude: number;
  longitude: number;
  recordedAt: Date;
  speedKmph: number;
  ignitionOn: boolean;
  isIdle: boolean;
  isStop: boolean;
  isOverSpeed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
