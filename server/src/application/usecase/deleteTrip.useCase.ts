import { ITripRepository } from "../../domain/interfaces/ITripRepository";

export class DeleteTripUseCase {
  constructor(private tripRepository: ITripRepository) {}

  async execute(tripId: string): Promise<void> {
    return this.tripRepository.delete(tripId);
  }
}
