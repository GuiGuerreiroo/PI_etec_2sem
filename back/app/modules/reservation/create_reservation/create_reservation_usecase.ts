import { IMaterialRepository } from "../../../shared/domain/interface/IMaterialRepository";
import { Reservation } from "../../../shared/domain/entities/resevation";
import { HOUR } from "../../../shared/domain/enums/hours";
import { STATUS } from "../../../shared/domain/enums/status";
import { IKitRepository } from "../../../shared/domain/interface/IKitRepository";
import { ILaboratoryRepository } from "../../../shared/domain/interface/ILaboratoryRepository";
import { IReservationRepository } from "../../../shared/domain/interface/IReservationRepository";
import { ReservationMongoDTO } from "../../../shared/repositories/database/mongo/reservation_repository_mongo";
import { BadRequestException, DatabaseException } from "../../../shared/helpers/exceptions";

interface CreateReservationInterface {
    date: string;
    hourEnum: HOUR;
    labId: string;
    userId: string;
    kitId: string;
}

// depois checar se fazemos validacao para ver se ja tem alguma reserva no mesmo dia e horario com o mesmo laboratorio

export class CreateReservationUseCase {
    constructor(
        private readonly reservationRepository: IReservationRepository,
        private readonly labRepository: ILaboratoryRepository,
        private readonly kitRepository: IKitRepository,
        private readonly materialRepository: IMaterialRepository,
    ) { }

    async execute({ date, hourEnum, labId, userId, kitId }: CreateReservationInterface): Promise<ReservationMongoDTO> {
        const lab = await this.labRepository.getLaboratoryById(labId);

        if (!lab)
            throw new Error("Laboratório não está no banco");

        const kit = await this.kitRepository.getKitById(kitId);

        if (!kit)
            throw new Error("Kit não está no banco");

        // fiz a validacao para ver se ja existe uma reserva para o mesmo laboratorio, data e hora
        const existingReservation = await this.reservationRepository.getReservationsByFilter({
            date: date,
            hour: hourEnum,
            labId: labId,
            status: STATUS.SCHEDULED
        });

        if (existingReservation)
            throw new BadRequestException("Já existe uma reserva para este laboratório nessa data e hora, tente novamente!");


        // nao fiz a validacao do userId, pois ele vem do userFromToken e para se gerar o token ja tem validacao para saber se ele esta no banco

        const newReservation = new Reservation(
            date,
            hourEnum,
            labId,
            userId,
            STATUS.SCHEDULED,
            kitId
        );


        // aqui so fiz a validacoa para retirar o item do banco se ele for reusable = false, e nao fiz validacao se isso será negativo, pois na rota de kit ja passo como disponível somente os kits que tem material suficiente
        for (const selectedMaterial of kit.materials) {
            try {
                const material = selectedMaterial.material;

                if (material.reusable === false) {
                    if (material.totalQuantity < selectedMaterial.selectedQuantity) {
                        throw new DatabaseException("Erro ao atualizar a quantidade do material, reserva não foi criada");
                    }
                    const response = await this.materialRepository.adjustMaterialQuantity(material.materialId!, (-selectedMaterial.selectedQuantity));

                    if (response === null)
                        throw new DatabaseException("Erro ao atualizar a quantidade do material, reserva não foi criada");
                }


            }
            catch (error) {
                throw new DatabaseException("Erro ao atualizar a quantidade do material, reserva não foi criada");
            }
        }

        const createdReservation = await this.reservationRepository.createReservation(newReservation);


        return createdReservation;
    }
}