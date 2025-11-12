import { KitMongoDTO } from "../../../shared/repositories/database/mongo/kit_repository_mongo";
import { isOrigin, ORIGIN, toEnum } from "../../../shared/domain/enums/origin";
import { BadRequestException } from "../../../shared/helpers/exceptions";

export async function createKitRequestValidate(body: unknown): Promise<{ name: string, materials: { selectedQuantity: number; materialId: string }[] }> {
    if (!body || typeof body !== 'object')
        throw new BadRequestException('request body inválido');

    const { name, materials } = body as {
        name: unknown;
        materials: unknown;
    }

    if (typeof name !== 'string' || name.length < 3)
        throw new BadRequestException('formato de nome inválido');

    if (!Array.isArray(materials) || materials.length === 0)
        throw new BadRequestException('formato de materiais inválido');

    for (const material of materials) {
        if (typeof material !== 'object' || material === null)
            throw new BadRequestException('formato de material inválido');

        if (typeof material.selectedQuantity !== 'number' || material.selectedQuantity <= 0)
            throw new BadRequestException('quantidade de material inválida');

        if (typeof material.materialId !== 'string' || material.materialId.length !== 24)
            throw new BadRequestException('materialId inválido');
    }

    return { name, materials };
}

export async function createKitResponse(newKit: KitMongoDTO) {
    return {
        message: "Kit criado com sucesso",
        kit: {
            id: newKit.id,
            name: newKit.name,
            materials: newKit.materials,
            origin: newKit.origin,
            userName: newKit.userName
        }
    };
}