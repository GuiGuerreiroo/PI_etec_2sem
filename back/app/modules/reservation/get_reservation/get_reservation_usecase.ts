import { HOUR } from "../../../shared/domain/enums/hours";
import { STATUS } from "../../../shared/domain/enums/status";
import { IReservationRepository } from "../../../shared/domain/interface/IReservationRepository";
import { ReservationMongoDTO } from "../../../shared/repositories/database/mongo/reservation_repository_mongo";

interface GetReservationInputInterface {
    id?: string;
    reservationFilter: {
        date?: string;
        hour?: HOUR;
        labId?: string;
        userId?: string;
        status?: STATUS;
    }
}

export class GetReservationUseCase {
    constructor(private readonly reservationRepository: IReservationRepository) {}

    async execute({ id, reservationFilter }: GetReservationInputInterface): Promise<ReservationMongoDTO[]| []> {
        // aqui ele sempre testa o id primeiro entao nao tem problema eu passar o id do usuario pelo token dele
        const selectedReservations = id
            ? await this.reservationRepository.getReservationById(id)
            : await this.reservationRepository.getReservationsByFilter(reservationFilter);

        if (!selectedReservations)
            return [];

        const reservationsArray =  Array.isArray(selectedReservations) ? selectedReservations : [selectedReservations];

        return reservationsArray;
    }
}