import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { getUserRequestValidate, getUserResponse } from "./get_user_schema";
import { GetUserUseCase } from "./get_user_usecase";

export class GetUserController {
    constructor(private readonly usecase: GetUserUseCase) {}

    async handler(req: Request, res: Response): Promise<void> {
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

        const {id, email}= await getUserRequestValidate(req.query);

        const user= await this.usecase.execute({
            id,
            email,
            isAdmin
        });

        const response= await getUserResponse(user);

        res.status(200).json(response);
    }
}