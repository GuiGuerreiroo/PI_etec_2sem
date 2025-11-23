import express, { Request, Response } from "express";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { MaterialRepository } from "../../../shared/repositories/repository";
import { UpdateMaterialUseCase } from "./update_material_usecase";
import { UpdateMaterialController } from "./update_material_controller";

const router = express.Router();

const repository= new MaterialRepository();
const updateMaterialUseCase= new UpdateMaterialUseCase(repository.materialRepo);
const updateMaterialController= new UpdateMaterialController(updateMaterialUseCase);

router.put("/material", authenticateToken,  async (req: Request, res: Response) => {
    await updateMaterialController.handler(req, res);
})

export default router;