import { User } from "../../../shared/domain/entities/user";
import { IUserRepository } from "../../../shared/domain/interface/IUserRepository";

export class GetAllUsersUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(): Promise<User[]> {
        return await this.userRepository.fetchUsers();
    }
}