import { getDistance } from "geolib";

export interface RawGpsData {
  latitude: number;
  longitude: number;
  recordedAt: Date;
  ignitionOn: boolean;
}

export interface ProcessedGpsPoint {
  idx: number;
  latitude: number;
  longitude: number;
  recordedAt: Date;
  speedKmph: number;
  ignitionOn: boolean;
  isIdle: boolean;
  isStop: boolean;
  isOverSpeed: boolean;
  distanceMeters: number;
  timeDiffMs: number;
}

export interface TripStatistics {
  totalDistanceMeters: number;
  durationMs: number;
  idleDurationMs: number;
  stoppageDurationMs: number;
  overspeedDurationMs: number;
  overspeedSegments: number;
  averageSpeedKmph: number;
  maxSpeedKmph: number;
}

const OVERSPEED_THRESHOLD = 60; // km/h
const MAX_SPEED_FOR_IDLE = 0; // km/h

export class TripCalculationService {
  /**
   * Process raw GPS data and calculate speed, idling, stoppage, and overspeed
   */
  processGpsData(rawData: RawGpsData[]): {
    points: ProcessedGpsPoint[];
    stats: TripStatistics;
    startedAt: Date;
    endedAt: Date;
  } {
    if (rawData.length === 0) {
      throw new Error("No GPS data provided");
    }

    const processedPoints: ProcessedGpsPoint[] = [];
    let totalDistance = 0;
    let idleDuration = 0;
    let stoppageDuration = 0;
    let overspeedDuration = 0;
    let overspeedSegments = 0;
    let isCurrentlyOverspeed = false;
    let maxSpeed = 0;
    let sumSpeed = 0;
    let validSpeedCount = 0;

    const startedAt = rawData[0].recordedAt;
    const endedAt = rawData[rawData.length - 1].recordedAt;

    let prevPoint: ProcessedGpsPoint | null = null;
    let idleStartTime: Date | null = null;
    let stoppageStartTime: Date | null = null;
    let overspeedStartTime: Date | null = null;

    for (let i = 0; i < rawData.length; i++) {
      const current = rawData[i];
      let speed = 0;
      let distance = 0;
      let timeDiff = 0;
      let isIdle = false;
      let isStop = false;
      let isOverSpeed = false;

      if (prevPoint) {
        // Calculate distance in meters
        distance = getDistance(
          { latitude: prevPoint.latitude, longitude: prevPoint.longitude },
          { latitude: current.latitude, longitude: current.longitude }
        );

        // Calculate time difference in milliseconds
        timeDiff = current.recordedAt.getTime() - prevPoint.recordedAt.getTime();

        // Calculate speed (km/h)
        if (timeDiff > 0) {
          const timeInHours = timeDiff / (1000 * 60 * 60);
          speed = distance > 0 ? (distance / 1000) / timeInHours : 0;
        }

        totalDistance += distance;
      }

      // Determine if vehicle is stopped (ignition off)
      if (!current.ignitionOn) {
        isStop = true;
        // End any idling period
        if (idleStartTime && prevPoint) {
          idleDuration += current.recordedAt.getTime() - idleStartTime.getTime();
          idleStartTime = null;
        }
        // Start or continue stoppage period
        if (!stoppageStartTime) {
          stoppageStartTime = prevPoint?.recordedAt || current.recordedAt;
        }
      } else {
        // Ignition is on
        // If was stopped before, calculate stoppage duration
        if (stoppageStartTime && prevPoint) {
          stoppageDuration += current.recordedAt.getTime() - stoppageStartTime.getTime();
          stoppageStartTime = null;
        }

        // Determine if vehicle is idling (ignition on but speed = 0 or very low and no movement)
        if (speed <= MAX_SPEED_FOR_IDLE && distance === 0) {
          isIdle = true;
          if (!idleStartTime) {
            idleStartTime = prevPoint?.recordedAt || current.recordedAt;
          }
        } else {
          // If was idling before, calculate idle duration
          if (idleStartTime && prevPoint) {
            idleDuration += current.recordedAt.getTime() - idleStartTime.getTime();
            idleStartTime = null;
          }
        }
      }

      // Check for overspeed (speed > 60 km/h) - only if we have a previous point to calculate speed
      if (prevPoint && speed > OVERSPEED_THRESHOLD) {
        isOverSpeed = true;
        if (!overspeedStartTime) {
          overspeedStartTime = prevPoint.recordedAt;
          isCurrentlyOverspeed = true;
        }
      } else {
        // If was overspeeding before, calculate overspeed duration
        if (overspeedStartTime && isCurrentlyOverspeed && prevPoint) {
          overspeedDuration += current.recordedAt.getTime() - overspeedStartTime.getTime();
          overspeedSegments++;
          overspeedStartTime = null;
          isCurrentlyOverspeed = false;
        }
      }

      // Update max speed
      if (speed > maxSpeed) {
        maxSpeed = speed;
      }

      // Track speeds for average (only when moving)
      if (speed > 0) {
        sumSpeed += speed;
        validSpeedCount++;
      }

      const processedPoint: ProcessedGpsPoint = {
        idx: i,
        latitude: current.latitude,
        longitude: current.longitude,
        recordedAt: current.recordedAt,
        speedKmph: speed,
        ignitionOn: current.ignitionOn,
        isIdle,
        isStop,
        isOverSpeed,
        distanceMeters: distance,
        timeDiffMs: timeDiff,
      };

      processedPoints.push(processedPoint);
      prevPoint = processedPoint;
    }

    // Handle any remaining idle/stoppage/overspeed periods
    if (idleStartTime && prevPoint) {
      idleDuration += prevPoint.recordedAt.getTime() - idleStartTime.getTime();
    }
    if (stoppageStartTime && prevPoint) {
      stoppageDuration += prevPoint.recordedAt.getTime() - stoppageStartTime.getTime();
    }
    if (overspeedStartTime && isCurrentlyOverspeed && prevPoint) {
      overspeedDuration += prevPoint.recordedAt.getTime() - overspeedStartTime.getTime();
      overspeedSegments++;
    }

    const duration = endedAt.getTime() - startedAt.getTime();
    const averageSpeed = validSpeedCount > 0 ? sumSpeed / validSpeedCount : 0;

    const stats: TripStatistics = {
      totalDistanceMeters: totalDistance,
      durationMs: duration,
      idleDurationMs: idleDuration,
      stoppageDurationMs: stoppageDuration,
      overspeedDurationMs: overspeedDuration,
      overspeedSegments,
      averageSpeedKmph: averageSpeed,
      maxSpeedKmph: maxSpeed,
    };

    return {
      points: processedPoints,
      stats,
      startedAt,
      endedAt,
    };
  }
}

