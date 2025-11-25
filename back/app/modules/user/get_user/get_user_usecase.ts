import { User } from "../../../shared/domain/entities/user";
import { IUserRepository } from "../../../shared/domain/interface/IUserRepository";
import { ForbiddenException, NotFoundException } from "../../../shared/helpers/exceptions";

export interface GetUserDTO {
    id?: string;
    email?: string;
    isAdmin: boolean;
}

export class GetUserUseCase {
    constructor(private readonly userRepository: IUserRepository){}

    async execute({id, email, isAdmin}: GetUserDTO): Promise<User> {
        const selectedUser= id
            ? await this.userRepository.getUserById(id)
            : await this.userRepository.getUserByEmail(email!);

        if (!selectedUser)
            throw new NotFoundException('Usuário não está no banco');

        if (!isAdmin && selectedUser.role === 'ADMIN')
            throw new ForbiddenException(
            "Você não tem permissão para visualizar um admin"
            );

        return selectedUser;
    }
}