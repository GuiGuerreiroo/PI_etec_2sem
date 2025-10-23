import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { Request, Response } from "express";
import { createUserRequestValidate, createUserResponse } from "./create_user_schema";
import { CreateUserUseCase } from "./create_user_usecase";

export class CreateUserController {
    constructor(private readonly usecase: CreateUserUseCase){}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"];

        let isAdmin= false

        if (!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        if (userFromToken.role === "ADMIN"){
            isAdmin= true;
        }

        const {name, email, roleEnum, password} = await createUserRequestValidate(req.body);

        const newUser= await this.usecase.execute({
            name,
            email,
            roleEnum,
            password,
            isAdmin
        });

        const response= await createUserResponse(newUser);

        res.status(201).json(response);
    }
}