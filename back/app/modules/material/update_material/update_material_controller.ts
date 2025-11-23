import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { updateMaterialRequestValidate, updateMaterialResponse } from "./update_material_schema";
import { UpdateMaterialUseCase } from "./update_material_usecase";
export class UpdateMaterialController {
    constructor(private readonly usecase: UpdateMaterialUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"];

        if (!allowedRoles.includes(userFromToken.role)) 
            throw new ForbiddenException("Você não tem permissão para acessar este recurso");

        const { id, totalQuantity, reusable}= await updateMaterialRequestValidate(req.body);

        const updatedMaterial= await this.usecase.execute({
            id,
            updateOptions: {
                totalQuantity,
                reusable
            }
        })

        const response= await updateMaterialResponse(updatedMaterial);

        res.status(200).json(response);
    }

}
