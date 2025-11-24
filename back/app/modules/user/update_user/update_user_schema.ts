import { User } from "../../../shared/domain/entities/user";
import { isRole, ROLE, toEnum } from "../../../shared/domain/enums/role";
import { BadRequestException } from "../../../shared/helpers/exceptions";

export async function updateUserRequestValidate(body: any): Promise<{
    id: string,
    name?: string,
    email?: string,
    role?: ROLE,
    isDeleted?: boolean,
}> {
    if (!body || typeof body !== 'object')
        throw new BadRequestException('corpo da requisição inválido');

    let { id, name, email, role, isDeleted } = body as {
        id?: unknown,
        name?: unknown,
        email?: unknown,
        role?: unknown,
        isDeleted?: unknown,
    }

    let roleEnum: ROLE | undefined = undefined;

    if (!id)
        throw new BadRequestException('o id do usuário é obrigatório');

    if (typeof id !== 'string' || id.length !== 24)
        throw new BadRequestException('formato do id inválido');

    if (!name && !email && !role && isDeleted === undefined) {
        throw new BadRequestException('forneça ao menos um dos campos para atualizar: name, email, role, isDeleted');
    }

    if (name) {
        if (typeof name !== 'string' || name.length < 3)
            throw new BadRequestException('formato de nome inválido');
    }

    if (email) {
        if (typeof email !== 'string' || !email.includes('@etec'))
            throw new BadRequestException('formato do email inválido');
    }

    if (role) {
        if (typeof role !== 'string' || !isRole(role))
            throw new BadRequestException('formato do role inválido');

        roleEnum = toEnum(role) as ROLE;
    }

    if (!isDeleted === undefined) {
        if (typeof isDeleted !== "boolean") {
            throw new BadRequestException('formato do isDeleted inválido: deve ser false para reativar o usuário');
        }
    }

    return {
        id,
        name: name as string | undefined,
        email: email as string | undefined,
        role: roleEnum as ROLE | undefined,
        isDeleted: isDeleted as boolean | undefined,
    }
}

export async function updateUserResponse(user: User) {
    return {
        message: "Usuário atualizado com sucesso",
        user: {
            id: user.userId,
            name: user.name,
            email: user.email,
            role: user.role,
            isDeleted: user.isDeleted,
        }
    };
}