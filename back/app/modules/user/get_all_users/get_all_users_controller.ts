import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { getAllUsersResponse } from "./get_all_users_schema";
import { GetAllUsersUseCase } from "./get_all_users_usecase";
import { toEnum } from "../../../shared/domain/enums/role";

export class GetAllUsersController {
    constructor(private readonly usecase: GetAllUsersUseCase) { }

    async handler(req: Request, res: Response): Promise<void> {
        const userFromToken = req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"];

        if (!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }
    
        const users = await this.usecase.execute({
            userFromTokenRole: toEnum(userFromToken.role)
        }
    );

        const response = await getAllUsersResponse(users);

        res.status(200).json(response);
    }
}