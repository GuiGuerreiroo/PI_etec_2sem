import { IReservationRepository } from "../../../shared/domain/interface/IReservationRepository";
import { ILaboratoryRepository } from "../../../shared/domain/interface/ILaboratoryRepository";

export interface LaboratoryAvailableOficialModel {
    laboratoryId: string;
    laboratoryName: string;
    available: boolean;
}

export class GetLaboratoriesStatusUseCase {
    constructor(
        private laboratoryRepo: ILaboratoryRepository,
        private reservationRepo: IReservationRepository
    ) { }

    async execute(date: string): Promise<LaboratoryAvailableOficialModel[]> {
        const reservationsScheduled = await this.reservationRepo.getReservationsByFilter({ date: date,  status: "MARCADO"})

        const allLaboratories = await this.laboratoryRepo.fetchLaboratories();

        if (reservationsScheduled === null) {

            const LaboratoryAvailableOficialModel = allLaboratories.map((lab) => {
                return {
                    laboratoryId: lab.labId!,
                    laboratoryName: lab.name,
                    available: true
                }
            })

            return LaboratoryAvailableOficialModel;
        }

        else {
            // aqui pego o nome (unique) dos laboratorios que ja foram reservados, e vou dando uma contagem para a quantidade de horarios que ele ja esta reservado, depois farei o tratamento disso.
            const reservedLabsMap= reservationsScheduled.reduce((acc, reservation) => {
                const labName = reservation.labName;

                const existingLab = acc.get(labName);

                if (existingLab) {
                    existingLab.count += 1;
                } 
                else {
                    acc.set(labName, {
                        name: labName,
                        count: 1
                    });
                }
                return acc;
            }, new Map());



            console.log(reservedLabsMap);
            // aqui eu verifico se o laboratorio esta reservado durante todo o dia (13 horarios), se tiver retorno que ele nao esta available (false), caso contrario, retorno que esta available (true)
            const LaboratoryAvailableOficialModel = allLaboratories.map((lab) => {
                const existingLab = reservedLabsMap.get(lab.name);

                if (existingLab) {
                    const full= (existingLab.count === 13);
                    return {
                        laboratoryId: lab.labId!,
                        laboratoryName: lab.name,
                        available: !full
                    };
                }
                else {
                    return {
                        laboratoryId: lab.labId!,
                        laboratoryName: lab.name,
                        available: true
                    };
                }
            })

            return LaboratoryAvailableOficialModel;
        }
    }
}