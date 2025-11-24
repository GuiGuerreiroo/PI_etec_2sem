import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import express, { Request, Response } from "express";
import { GetAllReservationsUseCase } from "./get_all_reservations_usecase";
import { GetAllReservationsController } from "./get_all_reservations_controller";
import { ReservationRepository } from "../../../shared/repositories/repository";

const router = express.Router();

const repository= new ReservationRepository();

const getAllReservationsUseCase= new GetAllReservationsUseCase(
    repository.reservationRepo
);
const getAllReservationsController= new GetAllReservationsController(getAllReservationsUseCase);

router.get("/reservations", authenticateToken, async (req: Request, res: Response) => {
    await getAllReservationsController.handler(req, res);
})

export default router;