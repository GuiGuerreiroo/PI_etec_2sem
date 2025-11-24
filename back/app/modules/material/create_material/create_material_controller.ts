import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { createMaterialRequestValidate, createMaterialResponse } from "./create_material_schema";
import { CreateMaterialUseCase } from "./create_material_uscase";

export class CreateMaterialController {
    constructor(private readonly usecase: CreateMaterialUseCase){}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"];

        if (!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const {name, reusable, totalQuantity, size}= await createMaterialRequestValidate(req.body);

        const newMaterial= await this.usecase.execute({
            name,
            reusable,
            totalQuantity,
            size
        });

        const response= await createMaterialResponse(newMaterial);

        res.status(201).json(response);
    }
}