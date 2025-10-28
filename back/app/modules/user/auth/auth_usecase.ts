import { ROLE } from "../../../shared/domain/enums/role";
import { IUserRepository } from "../../../shared/domain/interface/IUserRepository";
import { Encrypt } from "../../../shared/helpers/encrypt";
import { ForbiddenException, NotFoundException } from "../../../shared/helpers/exceptions";
import { JWToken } from "../../../shared/helpers/jwtoken";

interface AuthDTO {
    email: string;
    password: string
}

export interface OficialAuthResult{
    message: string
    token: string;
    user: {
        id: string,
        name: string,
        email: string,
        role: ROLE,
    };
}

export class AuthUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute({email, password}: AuthDTO): Promise<OficialAuthResult>{
        const user= await this.userRepository.getUserByEmail(email);

        console.log(user);

        if (!user)
            throw new NotFoundException("Usuário não está no banco");

        const validPassword = await Encrypt.verifyPassword(password, user.password);

        if (!validPassword)
            throw new ForbiddenException("Senha inválida")

        const token= JWToken.encode(user.userId!, user.role)

        return {
            message: "Login realizado com sucesso",
            token,
            user: {
                id: user.userId!,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        }
    }
}