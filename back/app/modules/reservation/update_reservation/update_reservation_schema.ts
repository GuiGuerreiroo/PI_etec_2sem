import { isStatus, STATUS, toEnumStatus } from "../../../shared/domain/enums/status";
import { BadRequestException } from "../../../shared/helpers/exceptions";
import { ReservationMongoDTO } from "../../../shared/repositories/database/mongo/reservation_repository_mongo";

export async function updateReservationRequestValidate(body: any): Promise<{
    id: string,
    labId?: string,
    status?: STATUS
}>{
    if (!body || typeof body !== 'object')
        throw new BadRequestException('corpo da requisição inválido');

    let {id, labId, status}= body as {
        id?: unknown,
        labId?: unknown,
        status?: unknown
    }

    let statusEnum: STATUS | undefined = undefined;

    if (!id)
        throw new BadRequestException('o id da reserva é obrigatório');

    if (typeof id !== 'string' || id.length !== 24)
        throw new BadRequestException('formato do id inválido');

    if (!labId && !status)
        throw new BadRequestException('forneça ao menos um dos campos para atualizar: labId, status');

    if (labId){
        if (typeof labId !== 'string' || labId.length !== 24)
            throw new BadRequestException('formato do labId inválido');
    }

    if (status){
        if (typeof status !== 'string' || !isStatus(status))
            throw new BadRequestException('formato do status inválido');
        
        statusEnum= toEnumStatus(status);
    }

    return {
        id,
        labId: labId as string | undefined,
        status: statusEnum as STATUS | undefined
    }
}

export async function updateReservationResponse(reservation: ReservationMongoDTO) {
    return {
        message: "Reserva atualizada com sucesso",
        reservation: {
            id: reservation.id,
            date: reservation.date,
            hour: reservation.hour,
            labName: reservation.labName,
            userName: reservation.userName,
            status: reservation.status,
            kit: reservation.kit
        }
    };
}