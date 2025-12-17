import csvParser from "csv-parser";
import { Readable } from "stream";
import { RawGpsData } from "./tripCalculation.service";

export class CsvParserService {
  /**
   * Parse CSV file and extract GPS data
   * Expected CSV format: latitude, longitude, recorded_at, ignition_on
   */
  async parseGpsCsv(fileBuffer: Buffer): Promise<RawGpsData[]> {
    return new Promise((resolve, reject) => {
      const results: RawGpsData[] = [];
      const stream = Readable.from(fileBuffer.toString());

      stream
        .pipe(csvParser())
        .on("data", (row: any) => {
          try {
            // Try to handle different possible column names
            const lat = parseFloat(row.latitude || row.Latitude || row.LAT || row.lat);
            const lng = parseFloat(row.longitude || row.Longitude || row.LNG || row.lon || row.lng);
            const recordedAtStr =
              row.recorded_at ||
              row.recordedAt ||
              row.Recorded_At ||
              row.timestamp ||
              row.Timestamp ||
              row.time ||
              row.Time;
            const ignitionOnStr =
              row.ignition_on ||
              row.ignitionOn ||
              row.Ignition_On ||
              row.ignition ||
              row.Ignition;

            if (isNaN(lat) || isNaN(lng)) {
              console.warn("Skipping row with invalid coordinates:", row);
              return;
            }

            // Parse date - try multiple formats
            let recordedAt: Date;
            try {
              recordedAt = new Date(recordedAtStr);
              if (isNaN(recordedAt.getTime())) {
                // Try parsing as ISO string or other formats
                recordedAt = new Date(recordedAtStr.replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/, "$1-$2-$3T$4:$5:$6"));
              }
              if (isNaN(recordedAt.getTime())) {
                console.warn("Skipping row with invalid date:", row);
                return;
              }
            } catch (e) {
              console.warn("Skipping row with invalid date:", row);
              return;
            }

            // Parse ignition status
            let ignitionOn = false;
            if (ignitionOnStr !== undefined && ignitionOnStr !== null) {
              if (typeof ignitionOnStr === "string") {
                ignitionOn =
                  ignitionOnStr.toLowerCase() === "true" ||
                  ignitionOnStr === "1" ||
                  ignitionOnStr.toLowerCase() === "on";
              } else {
                ignitionOn = Boolean(ignitionOnStr);
              }
            }

            results.push({
              latitude: lat,
              longitude: lng,
              recordedAt,
              ignitionOn,
            });
          } catch (error) {
            console.warn("Error parsing row:", row, error);
          }
        })
        .on("end", () => {
          if (results.length === 0) {
            reject(
              new Error(
                "No valid GPS data found in CSV file. Please ensure the CSV contains columns: latitude, longitude, recorded_at (or timestamp), ignition_on (or ignition)"
              )
            );
            return;
          }
          // Sort by recordedAt to ensure chronological order
          results.sort((a, b) => a.recordedAt.getTime() - b.recordedAt.getTime());
          resolve(results);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }
}

