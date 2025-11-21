import { Request, Response } from "express";
import { updateUserRequestValidate, updateUserResponse } from "./update_user_schema";
import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { UpdateUserUseCase } from "./update_user_usecase";

export class UpdateUserController {
    constructor(private readonly usecase: UpdateUserUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken;

        const allowedRoles = ["ADMIN"];

        if (!allowedRoles.includes(userFromToken.role)) 
            throw new ForbiddenException("Você não tem permissão para acessar este recurso");

        const { id, name, email, role }= await updateUserRequestValidate(req.body);

        const updatedUser= await this.usecase.execute({
            id,
            updateOptions: {
                name,
                email,
                role
            }
        })

        const response= await updateUserResponse(updatedUser);

        res.status(200).json(response);
    }
}