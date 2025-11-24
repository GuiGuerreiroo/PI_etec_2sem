import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { getAllReservationsResponse } from "./get_all_reservations_schema";
import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { GetAllReservationsUseCase } from "./get_all_reservations_usecase";
export class GetAllReservationsController {
    constructor(private readonly usecase: GetAllReservationsUseCase) {}

    async handler(req: Request, res: Response): Promise<void> {
        const userFromToken = req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"];

        if (!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const reservations = await this.usecase.execute();

        const response = await getAllReservationsResponse(reservations);

        res.status(200).json(response);
    }
}