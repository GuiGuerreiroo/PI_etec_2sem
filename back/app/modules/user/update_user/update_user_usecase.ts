import { User } from "../../../shared/domain/entities/user";
import { IUserRepository, UserUpdateOptions } from "../../../shared/domain/interface/IUserRepository";
import { ForbiddenException, NotFoundException } from "../../../shared/helpers/exceptions";

interface UpdateUserInputInterface {
    id: string;
    updateOptions: UserUpdateOptions;
}
export class UpdateUserUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute({id, updateOptions}: UpdateUserInputInterface): Promise<User> {
        const existingUser= await this.userRepository.getUserById(id);

        if (!existingUser)
            throw new NotFoundException("Usuário não encontrado");


        const updatedUser= await this.userRepository.updateUser(id, updateOptions);

        return updatedUser!;
    }
}