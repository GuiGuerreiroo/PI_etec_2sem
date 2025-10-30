import express, { Request, Response } from "express";
import { CreateKitUseCase } from "./create_kit_usecase";
import { CreateKitController } from "./create_kit_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { KitRepository } from "../../../shared/repositories/repository";

const router = express.Router();

const repository= new KitRepository();

const createKitUseCase= new CreateKitUseCase(repository.kitRepo, repository.materialRepo);
const createKitController= new CreateKitController(createKitUseCase);

router.post("/kit", authenticateToken,  async (req: Request, res: Response) => {
    await createKitController.handler(req, res);
})

export default router;