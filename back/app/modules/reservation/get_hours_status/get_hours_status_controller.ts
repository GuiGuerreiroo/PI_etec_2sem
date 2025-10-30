import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { getHoursStatusResponse, getHoursStatusValidate } from "./get_hours_status_schema";
import { GetHoursStatusUseCase } from "./get_hours_status_usecase";

export class GetHoursStatusController {
    constructor(private readonly usecase: GetHoursStatusUseCase) { }

    async handler(req: Request, res: Response) {
        const userFromToken = req.user as UserFromToken;

        const allowedRoles = ["PROFESSOR"];

        if (!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const { date, labId } = await getHoursStatusValidate(req.query);

        const hoursStatus = await this.usecase.execute({
            date,
            labId
        });

        const response = await getHoursStatusResponse(hoursStatus);

        res.status(200).json(response);
    }
}