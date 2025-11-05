import { UserRepository } from "../../../shared/repositories/repository";
import express, { Request, Response } from "express";
import { GetAllUsersUseCase } from "./get_all_users_usecase";
import { GetAllUsersController } from "./get_all_users_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";

const router = express.Router();

const repository = new UserRepository();
const getUsersUseCase = new GetAllUsersUseCase(repository.userRepo);
const getUsersController = new GetAllUsersController(getUsersUseCase);

router.get("/users", authenticateToken, async (req: Request, res: Response) => {
    await getUsersController.handler(req, res);
})

export default router;