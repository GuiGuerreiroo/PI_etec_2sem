import { IReservationRepository } from "../../../shared/domain/interface/IReservationRepository";

export class GetAllReservationsUseCase {
    constructor(private readonly reservationRepository: IReservationRepository) {}

    async execute() {
        return await this.reservationRepository.fetchReservations();
    }
}