import { BadRequestException } from "../../../shared/helpers/exceptions";

export async function deleteUserRequestValidate(body: unknown): Promise<{id: string}>{
    if (!body || typeof body !== 'object')
        throw new BadRequestException('request params inválido');

    const { id } = body as { id: unknown };

    if (typeof id !== 'string' || id.length !== 24)
        throw new BadRequestException('formato de id inválido');

    return {id};
}

export async function deleteUserResponse() {
    return {
        message: "Usuário desativado com sucesso",
    }
}