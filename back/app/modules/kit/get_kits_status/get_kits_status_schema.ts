import { HOUR, isHour, toEnum } from "../../../shared/domain/enums/hours";
import { BadRequestException } from "../../../shared/helpers/exceptions";
import { GetKitsStatusResponseInterface } from "./get_kits_status_usecase";

export async function getKitsStatusValidate(query: unknown): Promise<{date: string; hour: HOUR}> {
    if (!query || typeof query !== 'object')
        throw new BadRequestException('query inválida');

    let {date, hour}= query as {
        date?: unknown;
        hour?: unknown;
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

    // // todas as validacoes de labId
    // if (!labId || typeof labId !== 'string' || labId.length > 24)
    //     throw new BadRequestException('Id do laboratório inválido');

    if (!hour || typeof hour !== 'string' || !isHour(hour))
        throw new BadRequestException('hora inválida');

    const hourEnum= toEnum(hour);

    return {date, hour: hourEnum };
}

export async function getKitsStatusResponse(kitsStatus: GetKitsStatusResponseInterface[]) {
    return {
        message: "Status dos kits retornado com sucesso",
        kits: kitsStatus.map((kitsStatus) =>({
            kit: kitsStatus.kit,
            available: kitsStatus.available
        }))
    }
}