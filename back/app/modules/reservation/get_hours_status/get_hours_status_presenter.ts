import express, { Request, Response } from "express";
import { GetHoursStatusUseCase } from "./get_hours_status_usecase";
import { GetHoursStatusController } from "./get_hours_status_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { ReservationRepository } from "../../../shared/repositories/repository";

const router = express.Router();

const repository = new ReservationRepository();
const getHoursStatusUseCase = new GetHoursStatusUseCase(repository.reservationRepo, repository.laboratoryRepo);
const getHoursStatusController = new GetHoursStatusController(getHoursStatusUseCase);

router.get("/hours-status", authenticateToken,  async (req: Request, res: Response) => {
    await getHoursStatusController.handler(req, res);
})

export default router;