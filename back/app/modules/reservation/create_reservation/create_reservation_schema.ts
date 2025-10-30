import { HOUR, isHour, toEnum } from "../../../shared/domain/enums/hours";
import { BadRequestException } from "../../../shared/helpers/exceptions";
import { ReservationMongoDTO } from "../../../shared/repositories/database/mongo/reservation_repository_mongo";

export async function createReservationRequestValidate(body: unknown): Promise<{date: string; hourEnum: HOUR; labId: string; kitId: string}> {
    if (!body || typeof body !== 'object')
        throw new BadRequestException('body inválido');

    const {date, hour, labId, kitId}= body as {
        date?: unknown;
        hour?: unknown;
        labId?: unknown;
        kitId?: unknown;
    }

    // todas as validacoes de data
        if (!date || typeof date !== 'string')
            throw new BadRequestException('formato da data inválido');
    
        // formato YYYY-MM-DD
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
            throw new BadRequestException('formato da data inválido');
    
        // aqui coloquei as horas como 0 para diminuir a diferenca do fuso
        const today = new Date(new Date().setHours(0, 0, 0, 0));
    
        const inputDate = new Date(date);
    
        // diferenca em milisegundos
        const diffMills = inputDate.getTime() - today.getTime();
    
        // diferenca em dias
        const diffDays = diffMills / (1000 * 3600 * 24);
    
        //aqui coloquei -0.5 para também considerar uma margem para o fuso horario
        if (diffDays < -0.5)
            throw new BadRequestException('a data não pode ser no passado');
    
        if (diffDays > 30)
            throw new BadRequestException('a data não pode ser superior a 30 dias a partir de hoje');
    
        // todas as validacoes de labId
        if (!labId || typeof labId !== 'string' || labId.length > 24)
            throw new BadRequestException('Id do laboratório inválido');
    
        if (!hour || typeof hour !== 'string' || !isHour(hour))
            throw new BadRequestException('hora inválida');
    
        const hourEnum= toEnum(hour);

        if (!kitId || typeof kitId !== 'string' || kitId.length > 24)
            throw new BadRequestException('Id do kit inválido');

    return {date, hourEnum, labId, kitId};
}

export async function createReservationResponse(newReservation: ReservationMongoDTO){
    return {
        message: "Reserva criada com sucesso",
        reservation: {
            id: newReservation.id,
            date: newReservation.date,
            hour: newReservation.hour,
            labName: newReservation.labName,
            userName: newReservation.userName,
            status: newReservation.status,
            kit: newReservation.kit
        }
    }
}