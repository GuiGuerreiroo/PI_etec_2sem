import express, { Request, Response } from "express";
import { GetAllMaterialsUseCase } from "./get_all_materials_usecase";
import { MaterialRepository } from "../../../shared/repositories/repository";
import { GetAllMaterialsController } from "./get_all_materials_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";

const router = express.Router();

const repository= new MaterialRepository();
const getAllMaterialsUseCase= new GetAllMaterialsUseCase(repository.materialRepo);
const getAllMaterialsController= new GetAllMaterialsController(getAllMaterialsUseCase);

router.get("/materials", authenticateToken,  async (req: Request, res: Response) => {
    await getAllMaterialsController.handler(req, res);
})

export default router;