import express, { Request, Response } from "express";
import { CreateReservationUseCase } from "./create_reservation_usecase";
import { CreateReservationController } from "./create_reservation_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { ReservationRepository } from "../../../shared/repositories/repository";

const router = express.Router();

const repository= new ReservationRepository();

const createReservationUseCase= new CreateReservationUseCase(
    repository.reservationRepo,
    repository.laboratoryRepo,
    repository.kitRepo,
    repository.materialRepo
);
const createReservationController= new CreateReservationController(createReservationUseCase);

router.post("/reservation", authenticateToken,  async (req: Request, res: Response) => {
    await createReservationController.handler(req, res);
})

export default router;