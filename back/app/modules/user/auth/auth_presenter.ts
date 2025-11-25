import { UserRepository } from "../../../shared/repositories/repository";
import express, { Request, Response } from "express";
import { AuthUseCase } from "./auth_usecase";
import { AuthController } from "./auth_controller";


const router = express.Router();

const repository = new UserRepository();
const authUseCase = new AuthUseCase(repository.userRepo);
const authController = new AuthController(authUseCase);

router.post("/login", async (req: Request, res: Response) => {
    await authController.handler(req, res);
})

export default router;
