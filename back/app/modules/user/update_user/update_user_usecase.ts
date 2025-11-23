import { User } from "../../../shared/domain/entities/user";
import { IUserRepository, UserUpdateOptions } from "../../../shared/domain/interface/IUserRepository";
import { ForbiddenException, NotFoundException } from "../../../shared/helpers/exceptions";

interface UpdateUserInputInterface {
    id: string;
    updateOptions: UserUpdateOptions;
    isAdmin: boolean;
}

export class UpdateUserUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute({id, updateOptions, isAdmin}: UpdateUserInputInterface): Promise<User> {
        const existingUser= await this.userRepository.getUserById(id);

        if (!existingUser)
            throw new NotFoundException("Usuário não encontrado");

        if (existingUser.isDeleted && !updateOptions.isDeleted) {
            throw new ForbiddenException("Usuário está inativo. Reative o usuário antes de atualizá-lo.");
        }

        if (updateOptions.role) {
            if (!isAdmin) {
                throw new ForbiddenException("Apenas administradores podem alterar o ROLE do usuário");
            }
        }

        // aqui garanto que os tecnicos só podem reativar professores
        if (updateOptions.isDeleted){
            if (!isAdmin) {
                if (existingUser.role !== "PROFESSOR"){
                    throw new ForbiddenException("Apenas administradores podem reativar usuários que não sejam PROFESSOR");
                }
            }
        }


        const updatedUser= await this.userRepository.updateUser(id, updateOptions);

        return updatedUser!;
    }
}