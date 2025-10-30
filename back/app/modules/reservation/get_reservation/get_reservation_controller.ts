import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { getReservationRequestValidate, getReservationResponse } from "./get_reservation_schema";
import { GetReservationUseCase } from "./get_reservation_usecase";

export class GetReservationController {
    constructor(private readonly usecase: GetReservationUseCase) {}

    async handler(req: Request, res: Response): Promise<void> {
        const userFromToken= req.user as UserFromToken;

        
        const {id, date, hour, labId, status}= await getReservationRequestValidate(req.query)

        const reservations= await this.usecase.execute({
            id,
            reservationFilter: {
                date,
                hour,
                labId,
                userId: userFromToken.id,
                status
            }
        });


        const response= await getReservationResponse(reservations);

        res.status(200).json(response);
    }

}