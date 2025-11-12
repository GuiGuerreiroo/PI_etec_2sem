import { IReservationRepository, ReservationUpdateOptions } from "../../../shared/domain/interface/IReservationRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";
import { ReservationMongoDTO } from "../../../shared/repositories/database/mongo/reservation_repository_mongo";

interface UpdateReservationInputInterface {
    id: string;
    updateOptions: ReservationUpdateOptions
}

export class UpdateReservationUseCase {
    constructor(private readonly reservationRepository: IReservationRepository) {}

    async execute({id, updateOptions}: UpdateReservationInputInterface): Promise<ReservationMongoDTO> {
        const updatedReservation= await this.reservationRepository.updateReservationStatus(id, updateOptions);

        console.log(updatedReservation);

        if (!updatedReservation)
            throw new NotFoundException("Reserva não encontrada no banco");

        return updatedReservation;
    }
}