import { ReservationRepository } from "../../../shared/repositories/repository";
import express, { Request, Response } from "express";
import { UpdateReservationUseCase } from "./update_reservation_usecase";
import { UpdateReservationController } from "./update_reservation_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";

const router = express.Router();

const repository= new ReservationRepository();

const updateReservationUseCase= new UpdateReservationUseCase(
    repository.reservationRepo
);
const updateReservationController= new UpdateReservationController(updateReservationUseCase);

router.put("/reservation", authenticateToken, async (req: Request, res: Response) => {
    await updateReservationController.handler(req, res);
})

export default router;