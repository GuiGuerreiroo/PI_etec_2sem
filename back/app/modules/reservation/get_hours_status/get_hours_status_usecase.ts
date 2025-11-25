import { HOUR } from "../../../shared/domain/enums/hours";
import { IReservationRepository } from "../../../shared/domain/interface/IReservationRepository";

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
    ) { }

    async execute({ date, labId }: GetHoursStatusInput): Promise<GetHoursStatusDTO[]> {
        // nao fiz a validacao para o laboratorio existir pois presumo que me passara um id valido

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