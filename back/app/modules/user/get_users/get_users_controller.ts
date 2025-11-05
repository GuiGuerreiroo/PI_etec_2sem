import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { getUsersResponse } from "./get_users_schema";
import { GetUsersUseCase } from "./get_users_usecase";

export class GetUsersController {
    constructor(private readonly usecase: GetUsersUseCase) {}
    
    async handler(req: Request, res: Response): Promise<void> {
        const userFromToken= req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"];

        if (!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const users= await this.usecase.execute();

        const response= await getUsersResponse(users);

        res.status(200).json(response);
    }
}