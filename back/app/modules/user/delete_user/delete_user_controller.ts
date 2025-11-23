import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { deleteUserRequestValidate, deleteUserResponse } from "./delete_user_schema";
import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { DeleteUserUseCase } from "./delete_user_usecase";

export class DeleteUserController {
    constructor(private readonly usecase: DeleteUserUseCase){}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"];

        if (!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        let isAdmin= false

        if (userFromToken.role === "ADMIN"){
            isAdmin= true;
        }

        const { id } = await deleteUserRequestValidate(req.body);

        const deletedUser= await this.usecase.execute({
            id,
            isAdmin
        });

        const response= await deleteUserResponse();

        res.status(200).json(response);
    }
}