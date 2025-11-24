import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { createReservationRequestValidate, createReservationResponse } from "./create_reservation_schema";
import { CreateReservationUseCase } from "./create_reservation_usecase";

export class CreateReservationController {
    constructor(private readonly usecase: CreateReservationUseCase){}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken;

        const allowedRoles = ["PROFESSOR"];
        
        if (!allowedRoles.includes(userFromToken.role))
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );

        const {date, hourEnum, labId, kitId}= await createReservationRequestValidate(req.body);

        const newReservation= await this.usecase.execute({
            date,
            hourEnum,
            labId,
            kitId,
            userId: userFromToken.id
        });

        const response= await createReservationResponse(newReservation);

        res.status(201).json(response);
    }
}