import { Request, Response } from "express";
import { authRequestValidate } from "./auth_schema";
import { AuthUseCase } from "./auth_usecase";
export class AuthController {
    constructor(
        private readonly usecase: AuthUseCase,
    ) {}

    async handler(req: Request, res: Response){
        const { email, password } = await authRequestValidate(req.body);

        const result = await this.usecase.execute({ 
            email, 
            password 
        });

        res.status(200).json(result);
    }
}