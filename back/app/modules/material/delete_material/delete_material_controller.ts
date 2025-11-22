import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { deleteMaterialRequestValidate, deleteMaterialResponse } from "./delete_material_schema";
import { DeleteMaterialUseCase } from "./delete_material_usecase";

export class DeleteMaterialController {
    constructor(private usecase: DeleteMaterialUseCase) {}

    async handler(req: Request, res: Response){
        const userFromToken = req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR"];

        if (!allowedRoles.includes(userFromToken.role)) {
            throw new ForbiddenException(
                "Você não tem permissão para acessar este recurso"
            );
        }

        const { id } = await deleteMaterialRequestValidate(req.body);

        const deletedMaterial = await this.usecase.execute(
            id,
        );

        const response = await deleteMaterialResponse();

        res.status(200).json(response);
    }
}