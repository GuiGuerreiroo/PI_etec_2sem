import { KitRepository } from "../../../shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetAllKitsUseCase } from "./get_all_kits_usecase";
import { GetAllKitsController } from "./get_all_kits_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";

const router = express.Router();

const repository= new KitRepository();

const getAllKitsUseCase= new GetAllKitsUseCase(repository.kitRepo);
const getAllKitsController= new GetAllKitsController(getAllKitsUseCase);

router.get("/kits", authenticateToken,  async (req: Request, res: Response) => {
    await getAllKitsController.handler(req, res);
})

export default router;