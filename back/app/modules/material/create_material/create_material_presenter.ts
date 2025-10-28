import express, { Request, Response } from "express";
import { CreateMaterialController } from "./create_material_controller";
import { CreateMaterialUseCase } from "./create_material_uscase";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { MaterialRepository } from "../../../shared/repositories/repository";

const router = express.Router();

const repository= new MaterialRepository();
const createMaterialUseCase= new CreateMaterialUseCase(repository.materialRepo);
const createMaterialController= new CreateMaterialController(createMaterialUseCase);

router.post("/material", authenticateToken,  async (req: Request, res: Response) => {
    await createMaterialController.handler(req, res);
})

export default router;