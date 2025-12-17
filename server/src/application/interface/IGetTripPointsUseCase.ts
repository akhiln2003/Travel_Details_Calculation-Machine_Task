import { GpsPointDoc } from "../../infrastructure/database/mongodb/schemas/gpsPoint.schema";

export interface IGetTripPointsUseCase {
  execute(tripId: string, userId: string): Promise<GpsPointDoc[]>;
}

