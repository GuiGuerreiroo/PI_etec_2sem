import { ROLE } from "../../../shared/domain/enums/role";
import { User } from "../../../shared/domain/entities/user";
import { IUserRepository } from "../../../shared/domain/interface/IUserRepository";

interface GetAllUsersInputInterface {
    userFromTokenRole: ROLE;
}

export class GetAllUsersUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute({userFromTokenRole}: GetAllUsersInputInterface): Promise<User[]> {
        if (userFromTokenRole === ROLE.MODERATOR){
            return await this.userRepository.getAllProfessors();
        }
        
        return await this.userRepository.fetchUsers();
    }
}