import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { getLaboratoriesStatusResponse, getLaboratoriesStatusValidate } from "./get_laboratories_status_schema";
import { GetLaboratoriesStatusUseCase } from "./get_laboratories_status_usecase";

export class GetLaboratoriesStatusController {
    constructor(private usecase: GetLaboratoriesStatusUseCase) { }

    async handler(req: Request, res: Response): Promise<void> {
        const userFromToken = req.user as UserFromToken;

        const allowedRoles = ["PROFESSOR"];

        if (!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const { date } = await getLaboratoriesStatusValidate(req.query);

        const laboratories = await this.usecase.execute(
            date
        );

        const response = await getLaboratoriesStatusResponse(laboratories);

        res.status(200).json(response);
    }
}