import { ForbiddenException } from "../../../shared/helpers/exceptions";
import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { updateKitRequestValidate, updateKitResponse } from "./update_kit_schema";
import { UpdateKitUseCase } from "./update_kit_usecase";
export class UpdateKitController {
    constructor(private readonly usecase: UpdateKitUseCase) {}

    async handler(req: Request, res: Response) {
        const userFromToken= req.user as UserFromToken;

        const allowedRoles = ["ADMIN", "MODERATOR", "PROFESSOR"];

        if (!allowedRoles.includes(userFromToken.role)) 
            throw new ForbiddenException("Você não tem permissão para acessar este recurso");

        const isAdminOrModerator = ["ADMIN", "MODERATOR"].includes(userFromToken.role);

        const {id, name, materials} = await updateKitRequestValidate(req.body);

        const updatedKit = await this.usecase.execute({
            id,
            updateOptions: {
                name,
                materials
            },
            isAdminOrModerator
        });

        const response = await updateKitResponse(updatedKit);

        res.status(200).json(response);
    }
}