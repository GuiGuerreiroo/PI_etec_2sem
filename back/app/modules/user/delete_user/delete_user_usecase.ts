import { User } from "../../../shared/domain/entities/user";
import { IUserRepository } from "../../../shared/domain/interface/IUserRepository";
import { ForbiddenException, NotFoundException } from "../../../shared/helpers/exceptions";

export interface DeleteUserInputInterface {
    id: string;
    isAdmin: boolean;
}

export class DeleteUserUseCase {
    constructor(private readonly userRepository: IUserRepository){}

    async execute({id, isAdmin}: DeleteUserInputInterface): Promise<User> {
        const existingUser= await this.userRepository.getUserById(id);

        if (!existingUser)
            throw new NotFoundException("Usuário não encontrado");

        if (existingUser.role === 'ADMIN' && !isAdmin || existingUser.role === 'MODERATOR' && !isAdmin)
            throw new ForbiddenException("Você não tem permissão para deletar um admin");

        const deletedUser= await this.userRepository.deleteUserById(id);

        return deletedUser!;
    }
}