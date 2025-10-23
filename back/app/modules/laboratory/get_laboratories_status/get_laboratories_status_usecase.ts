import { IReservationRepository } from "../../../shared/domain/interface/IReservationRepository";
import { ILaboratoryRepository } from "../../../shared/domain/interface/ILaboratoryRepository";

export interface LaboratoryAvailableOficialModel{
    laboratoryName: string;
    available: boolean;
}

export class GetLaboratoriesStatusUseCase {
    constructor(
        private laboratoryRepo: ILaboratoryRepository,
        private reservationRepo: IReservationRepository
    ) {}

    async execute(date: string): Promise<LaboratoryAvailableOficialModel[]> {
        const reservationsScheduled= await this.reservationRepo.getReservationByFilter({date})

        const allLaboratories= await this.laboratoryRepo.fetchLaboratories();

        if (reservationsScheduled === null){
            
            const LaboratoryAvailableOficialModel= allLaboratories.map( (lab) => {
                return {
                    laboratoryName: lab.name,
                    available: true
                }
            })
        
            return LaboratoryAvailableOficialModel;
        }

        else{
            // aqui pego os id dos laboratorios que ja foram reservados
            // uso esse Set para remover os duplicados caso haja (nao havera)
            const reservedLabIds = new Set(reservationsScheduled.map((reservation) => reservation.idLab));

            // aqui monto o modelo oficial checando se dentro da lista de todos os laboratorios reservados se tem  os laboratorios disponiveis
            const LaboratoryAvailableOficialModel= allLaboratories.map((lab)=> {
                const isReserved = reservedLabIds.has(lab.idLab);

                return {
                    laboratoryName: lab.name,
                    available: !isReserved
                };
            })

            return LaboratoryAvailableOficialModel;
        }
    }
}