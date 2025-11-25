import { ROLE } from "../../../shared/domain/enums/role";
import { IUserRepository } from "../../../shared/domain/interface/IUserRepository";
import { User } from "../../../shared/domain/entities/user";
import { Encrypt } from "../../../shared/helpers/encrypt";
import { BadRequestException, ForbiddenException } from "../../../shared/helpers/exceptions";

export interface CreateUserDTO {
    name: string;
    email: string;
    roleEnum: ROLE;
    password: string;
    isAdmin: boolean;
}

export class CreateUserUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute({name, email, roleEnum, password, isAdmin}: CreateUserDTO): Promise<User> {
        if (roleEnum === ROLE.ADMIN && !isAdmin || roleEnum === ROLE.MODERATOR && !isAdmin) {
            throw new ForbiddenException("Apenas administradores podem criar usuários com ROLE de ADMIN ou MODERATOR");
        }

        const existingUser = await this.userRepository.getUserByEmail(email);

        if (existingUser) {
            throw new BadRequestException("Email já está cadastrado");
        }

        const hashedPassword = await Encrypt.hashPassword(password);

        // const userId= await crypto.randomUUID();

        const newUser = new User(
            name,
            email,
            roleEnum,
            hashedPassword,
        );

        const createdUser= await this.userRepository.createUser(newUser);

        // console.log(this.userRepository.fetchUsers());

        return createdUser;
    }
}