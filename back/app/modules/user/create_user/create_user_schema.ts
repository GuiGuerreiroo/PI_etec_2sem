import { User } from "back/app/shared/domain/entities/user";
import { isRole, ROLE, toEnum} from "../../../shared/domain/enums/role";
import { BadRequestException } from "../../../shared/helpers/exceptions";

export async function createUserRequestValidate(body: unknown): Promise<{name: string, email: string, roleEnum: ROLE, password: string}>{
    if (!body || typeof body !== 'object')
        throw new BadRequestException('request body inválido');

    const {name, email, role, password} = body as {
        name: unknown;
        email: unknown;
        role: unknown;
        password: unknown;
    }

    if (typeof name !== 'string' || name.length < 3)
        throw new BadRequestException('formato de nome inválido');

    if (typeof email !== 'string' || !email.includes('@etec'))
        throw new BadRequestException('formato do email inválido');

    if (typeof role !== 'string' || !isRole(role))
        throw new BadRequestException('formato role não esta dentro das disponíveis');

    const roleEnum= toEnum(role)

    if(typeof password !== 'string' || password.length < 6)
        throw new BadRequestException('senha deve ter pelo menos 6 caracteres');



    return {name, email, roleEnum, password}
       

}

export async function createUserResponse(newUser: User) {
    return {
        message: "Usuário criado com sucesso",
        user: {
            id: newUser.userId,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            isDeleted: newUser.isDeleted,
        }
    }
}