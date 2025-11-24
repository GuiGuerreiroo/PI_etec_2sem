import express, { Request, Response } from "express";
import { GetLaboratoriesStatusUseCase } from "./get_laboratories_status_usecase";
import { GetLaboratoriesStatusController } from "./get_laboratories_status_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { LabRepository } from "../../../shared/repositories/repository";

const router = express.Router();

const repository = new LabRepository();
const getLaboratoriesStatusUseCase = new GetLaboratoriesStatusUseCase(repository.laboratoryRepo, repository.reservationRepo);
const getLaboratoriesStatusController = new GetLaboratoriesStatusController(getLaboratoriesStatusUseCase);

router.get("/lab-status", authenticateToken,  async (req: Request, res: Response) => {
    await getLaboratoriesStatusController.handler(req, res);
})

export default router;