import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { updateReservationRequestValidate, updateReservationResponse } from "./update_reservation_schema";
import { UpdateReservationUseCase } from "./update_reservation_usecase";

export class UpdateReservationController {
    constructor(private readonly usecase: UpdateReservationUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"];

        if (!allowedRoles.includes(userFromToken.role)) 
            throw new ForbiddenException("Você não tem permissão para acessar este recurso");
        
        const { id, labId, status }= await updateReservationRequestValidate(req.body);

        const updatedReservation= await this.usecase.execute({
            id,
            updateOptions: {
                labId,
                status
            },
        })
        console.log(updatedReservation);
        
        const response= await updateReservationResponse(updatedReservation);

        res.status(200).json(response);

    }
}