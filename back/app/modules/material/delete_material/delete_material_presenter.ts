import express, { Request, Response } from "express";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { MaterialRepository } from "../../../shared/repositories/repository";
import { DeleteMaterialUseCase } from "./delete_material_usecase";
import { DeleteMaterialController } from "./delete_material_controller";

const router = express.Router();

const repository= new MaterialRepository();
const deleteMaterialUseCase= new DeleteMaterialUseCase(repository.materialRepo);
const deleteMaterialController= new DeleteMaterialController(deleteMaterialUseCase);

router.delete("/material", authenticateToken,  async (req: Request, res: Response) => {
    await deleteMaterialController.handler(req, res);
})

export default router;