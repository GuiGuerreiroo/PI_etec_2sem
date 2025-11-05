import { UserRepository } from "../../../shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetUsersUseCase } from "./get_users_usecase";
import { GetUsersController } from "./get_users_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";

const router = express.Router();

const repository = new UserRepository();
const getUsersUseCase = new GetUsersUseCase(repository.userRepo);
const getUsersController = new GetUsersController(getUsersUseCase);

router.get("/users", authenticateToken, async (req: Request, res: Response) => {
    await getUsersController.handler(req, res);
})

export default router;