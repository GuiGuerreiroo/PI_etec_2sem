import { HOUR, isHour, toEnum } from "../../../shared/domain/enums/hours";
import { isStatus, STATUS, toEnumStatus } from "../../../shared/domain/enums/status";
import { BadRequestException } from "../../../shared/helpers/exceptions";
import { ReservationMongoDTO } from "../../../shared/repositories/database/mongo/reservation_repository_mongo";

export async function getReservationRequestValidate(query: unknown): Promise<{
    id?: string,
    date?: string,
    hour?: HOUR,
    userId?: string,
    labId?: string,
    status?: STATUS
}>{
    if (!query || typeof query !== 'object')
        throw new BadRequestException('query strings inválida');

    let {id, date, hour, userId, labId, status} = query as {
        id?: unknown;
        date?: unknown;
        hour?: unknown;
        userId?: unknown;
        labId?: unknown;
        status?: unknown;
    }

    let hourEnum: HOUR | undefined = undefined;
    let statusEnum: STATUS | undefined = undefined;

    if (id && date || id && hour || id && userId || id && labId || id && status)
        throw new BadRequestException('forneça apenas um dos parâmetros: id ou os filtro de reserva');

    if (!id && !date && !hour && !userId && !labId && !status)
        throw new BadRequestException('forneça o id ou ao menos um dos filtros de reserva: date, hour, labId, userId, status');

    if (id){
        if (typeof id !== 'string' || id.length > 24)
            throw new BadRequestException('formato do id inválido');
    }

    if (date){
        if (typeof date !== 'string')
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
    }

    if (hour){
       if (typeof hour !== 'string' || !isHour(hour))
        throw new BadRequestException('hora inválida');
       
        hourEnum= toEnum(hour);
    }

    if (labId){
        if (typeof labId !== 'string' || labId.length > 24)
            throw new BadRequestException('formato do labId inválido');
    }

    if (userId){
        if (typeof userId !== 'string' || userId.length > 24)
            throw new BadRequestException('formato do userId inválido');
    }

    if (status){
        if (typeof status !== 'string' || !isStatus(status))
            throw new BadRequestException('formato do status inválido');

        statusEnum= toEnumStatus(status);
    }
    
    return {
        id: id as string | undefined,
        date: date as string | undefined,
        hour: hourEnum as HOUR | undefined,
        labId: labId as string | undefined,
        userId: userId as string | undefined,
        status: statusEnum as STATUS | undefined
    };
}

export async function getReservationResponse(reservations: ReservationMongoDTO[]) {
    return {
        message: "Reserva(s) retornada(s) com sucesso",
        reservations: reservations.map((reservation) => ({
            id: reservation.id,
            date: reservation.date,
            hour: reservation.hour,
            labName: reservation.labName,
            userName: reservation.userName,
            status: reservation.status,
            kit: reservation.kit
        }))
    }
}