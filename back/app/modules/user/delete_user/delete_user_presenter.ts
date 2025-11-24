import express, { Request, Response } from "express";
import { UserRepository } from "../../../shared/repositories/repository";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { DeleteUserUseCase } from "./delete_user_usecase";
import { DeleteUserController } from "./delete_user_controller";

const router = express.Router();

const repository = new UserRepository();

const deleteUserUseCase = new DeleteUserUseCase(repository.userRepo);
const deleteUserController = new DeleteUserController(deleteUserUseCase);

router.delete("/user", authenticateToken, async (req: Request, res: Response) => {
    await deleteUserController.handler(req, res);
})

export default router;