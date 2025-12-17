export interface IDeleteTripUseCase {
    execute(tripId: string): Promise<void>;
  }