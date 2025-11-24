import express, { Request, Response } from "express";
import { UserRepository } from "../../../shared/repositories/repository";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { UpdateUserUseCase } from "./update_user_usecase";
import { UpdateUserController } from "./update_user_controller";

const router = express.Router();

const repository = new UserRepository();

const updateUserUseCase = new UpdateUserUseCase(repository.userRepo);
const updateUserController = new UpdateUserController(updateUserUseCase);

router.put("/user", authenticateToken, async (req: Request, res: Response) => {
    await updateUserController.handler(req, res);
})

export default router;