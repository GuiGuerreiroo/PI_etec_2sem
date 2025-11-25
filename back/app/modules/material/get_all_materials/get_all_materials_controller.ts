import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { getAllMaterialsResponse } from "./get_all_materials_schema";
import { GetAllMaterialsUseCase } from "./get_all_materials_usecase";

export class GetAllMaterialsController {
    constructor(private usecase: GetAllMaterialsUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken = req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR", "PROFESSOR"];

        if (!allowedRoles.includes(userFromToken.role))
            throw new ForbiddenException("Você não tem permissão para acessar este recurso");

        const materials = await this.usecase.execute();

        const response= await getAllMaterialsResponse(materials);

        res.status(200).json(response);
    }
}