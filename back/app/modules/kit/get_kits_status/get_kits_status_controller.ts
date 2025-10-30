import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { Request, Response } from "express";
import { getKitsStatusResponse, getKitsStatusValidate } from "./get_kits_status_schema";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { GetKitsStatusUseCase } from "./get_kits_status_usecase";

export class GetKitsStatusController {
    constructor(private readonly usecase: GetKitsStatusUseCase){}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken;

        const allowedRoles = ["PROFESSOR"];
        
        if (!allowedRoles.includes(userFromToken.role))
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );

        const {date, hour}= await getKitsStatusValidate(req.query);

        const kitsStatus= await this.usecase.execute({
            date,
            hour,
            userId: userFromToken.id
        });

        const response= await getKitsStatusResponse(kitsStatus);

        res.status(200).json(response);
    }
}