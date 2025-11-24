import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { KitRepository } from "../../../shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetKitsStatusUseCase } from "./get_kits_status_usecase";
import { GetKitsStatusController } from "./get_kits_status_controller";

const router = express.Router();

const repository= new KitRepository();

const getKitsStatusUseCase= new GetKitsStatusUseCase(repository.kitRepo, repository.reservationRepo);
const getKitsStatusController= new GetKitsStatusController(getKitsStatusUseCase);

router.get("/kit-status", authenticateToken,  async (req: Request, res: Response) => {
    await getKitsStatusController.handler(req, res);
})

export default router;