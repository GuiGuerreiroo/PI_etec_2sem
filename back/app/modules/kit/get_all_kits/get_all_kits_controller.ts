import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { getAllKitsResponse } from "./get_all_kits_schema";
import { GetAllKitsUseCase } from "./get_all_kits_usecase";

export class GetAllKitsController {
    constructor(private readonly usecase: GetAllKitsUseCase){}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken;

        const allowedRoles= ["ADMIN", "MODERATOR", "PROFESSOR"];

        if(!allowedRoles.includes(userFromToken.role))
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );

        const kits= await this.usecase.execute({
            requesterUserId: userFromToken.id,
            requesterUserRole: userFromToken.role
        });

        const response= await getAllKitsResponse(kits);
        
        res.status(200).json(response);
    }
}