import { ReservationRepository } from "../../../shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetReservationUseCase } from "./get_reservation_usecase";
import { GetReservationController } from "./get_reservation_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";

const router = express.Router();

const repository= new ReservationRepository();

const getReservationUseCase= new GetReservationUseCase(
    repository.reservationRepo
);
const getReservationController= new GetReservationController(getReservationUseCase);

router.get("/reservation", authenticateToken, async (req: Request, res: Response) => {
    await getReservationController.handler(req, res);
})

export default router;