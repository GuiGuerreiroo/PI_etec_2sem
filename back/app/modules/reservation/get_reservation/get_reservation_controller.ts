import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { getReservationRequestValidate, getReservationResponse } from "./get_reservation_schema";
import { GetReservationUseCase } from "./get_reservation_usecase";
import { ForbiddenException } from "../../../shared/helpers/exceptions";

export class GetReservationController {
    constructor(private readonly usecase: GetReservationUseCase) {}

    async handler(req: Request, res: Response): Promise<void> {
        const userFromToken= req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR", "PROFESSOR"];

        if (!allowedRoles.includes(userFromToken.role))
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );

        let isAdminOrModerator= false;

        if (["ADMIN", "MODERATOR"].includes(userFromToken.role))
            isAdminOrModerator= true;

        const {id, date, hour, labId, userId, status}= await getReservationRequestValidate(req.query)

        const reservations= await this.usecase.execute({
            id,
            reservationFilter: {
                date,
                hour,
                labId,
                userId,
                status
            },
            isAdminOrModerator,
            userFromToken
        });

        if (reservations.length === 0) {
            const response= {
                message: "Nenhuma reserva encontrada",
                reservations: []
            }
            res.status(200).json(response); 
        }

        else{
            const response= await getReservationResponse(reservations);
    
            res.status(200).json(response);
        }
    }

}