import { UserRepository } from "../../../shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetUserUseCase } from "./get_user_usecase";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";
import { GetUserController } from "./get_user_controller";

const router = express.Router();

const repository = new UserRepository();
const getUserUseCase = new GetUserUseCase(repository.userRepo);
const getUserController = new GetUserController(getUserUseCase);

router.get("/user", authenticateToken, async (req: Request, res: Response) => {
    await getUserController.handler(req, res);
})

export default router;