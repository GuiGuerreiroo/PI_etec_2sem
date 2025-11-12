import { User } from "../../../shared/domain/entities/user";
import { BadRequestException } from "../../../shared/helpers/exceptions";

export async function getUserRequestValidate(query: unknown): Promise<{ id?: string, email?: string }> {
    if (!query || typeof query !== 'object')
        throw new BadRequestException('query strings inválida');

    const { id, email } = query as {
        id?: unknown;
        email?: unknown;
    }

    if (id && email) {
        throw new BadRequestException('forneça apenas um dos parâmetros: id ou email');
    }

    if (!id && !email) {
        throw new BadRequestException('forneça um dos parâmetros: id ou email');
    }

    if (id) {
        if (typeof id !== 'string' || id.length !== 24)
            throw new BadRequestException('formato do id inválido');
    }

    if (email) {
        if (typeof email !== 'string' || !email.includes('@etec'))
            throw new BadRequestException('formato do email inválido');
    }

    return {
        id: id as string | undefined,
        email: email as string | undefined
    };
}

export async function getUserResponse(selectedUser: User) {
    return {
        message: "Usuário retornado com sucesso",
        user: {
            id: selectedUser.userId,
            name: selectedUser.name,
            role: selectedUser.role,
            email: selectedUser.email,
        }
    };
}