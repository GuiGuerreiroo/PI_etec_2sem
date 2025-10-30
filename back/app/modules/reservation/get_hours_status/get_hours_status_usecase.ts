import { ILaboratoryRepository } from "../../../shared/domain/interface/ILaboratoryRepository";
import { HOUR } from "../../../shared/domain/enums/hours";
import { IReservationRepository } from "../../../shared/domain/interface/IReservationRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";

interface GetHoursStatusInput {
    date: string;
    labId: string;
}

export interface GetHoursStatusDTO {
    hour: HOUR;
    available: boolean;
}

export class GetHoursStatusUseCase {
    constructor(
        private reservationRepo: IReservationRepository,
        private laboratoryRepo: ILaboratoryRepository
    ) { }

    async execute({ date, labId }: GetHoursStatusInput): Promise<GetHoursStatusDTO[]> {
        const laboratory = await this.laboratoryRepo.getLaboratoryById(labId);

        if (!laboratory) {
            throw new NotFoundException("Laboratório não encontrado no banco de dados");
        }

        const reservationsScheduled = await this.reservationRepo.getReservationsByFilter({ date: date, labId: labId, status: "MARCADO" });

        if (reservationsScheduled === null) {
            const hoursStatus = Object.values(HOUR).map((hour) => {
                return {
                    hour,
                    available: true
                }
            })

            return hoursStatus;
        }

        else {
            const reservedHours = new Set(reservationsScheduled
                .map((reservation) => reservation.hour));

            const hoursStatus = Object.values(HOUR).map((hour) => {
                const isReserved = reservedHours.has(hour);
                return {
                    hour,
                    available: !isReserved
                };
            })

            return hoursStatus;
        }
    }
}