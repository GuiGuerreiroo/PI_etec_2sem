import express, { Request, Response } from "express";
import { CreateUserUseCase } from "./create_user_usecase";
import { UserRepository } from "../../../shared/repositories/repository";
import { CreateUserController } from "./create_user_controller";
import { authenticateToken } from "../../../shared/middleware/jwt_middleware";

const router = express.Router();

const repository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(repository.userRepo);
const createUserController = new CreateUserController(createUserUseCase);

router.post("/user", authenticateToken,  async (req: Request, res: Response) => {
    await createUserController.handler(req, res);
})

export default router;