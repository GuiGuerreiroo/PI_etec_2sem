import { UserFromToken } from "../../../shared/middleware/jwt_middleware";
import { Request, Response } from "express";
import { createKitRequestValidate, createKitResponse } from "./create_kit_schema";
import { CreateKitUseCase } from "./create_kit_usecase";

export class CreateKitController {
    constructor(private readonly usecase: CreateKitUseCase){}

    async handler(req: Request, res: Response){
        const userFromToken= req.user as UserFromToken;

        let userId: string | undefined;


        const adminRoles= ["ADMIN", "MODERATOR"];

        if (!adminRoles.includes(userFromToken.role))
            userId= userFromToken.id;

        const {name, materials} = await createKitRequestValidate(req.body);

        const newKit= await this.usecase.execute({
            name,
            materials,
            userId
        });

        const response= await createKitResponse(newKit);

        res.status(201).json(response);
    }
}