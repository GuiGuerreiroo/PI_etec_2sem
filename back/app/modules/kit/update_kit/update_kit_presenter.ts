import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import express, { Request, Response } from "express";
import { KitRepository } from "../../../shared/repositories/repository";
import { UpdateKitUseCase } from "./update_kit_usecase";
import { UpdateKitController } from "./update_kit_controller";

const router = express.Router();

const repository= new KitRepository();

const updateKitUseCase= new UpdateKitUseCase(repository.kitRepo, repository.materialRepo);
const updateKitController= new UpdateKitController(updateKitUseCase);

router.put("/kit", authenticateToken,  async (req: Request, res: Response) => {
    await updateKitController.handler(req, res);
})

export default router;