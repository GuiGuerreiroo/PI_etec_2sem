import { BadRequestException } from "../../../shared/helpers/exceptions";
import { KitMongoDTO } from "../../../shared/repositories/database/mongo/kit_repository_mongo";

export async function updateKitRequestValidate(body: any): Promise<{
    id: string,
    name?: string,
    materials?: {selectedQuantity: number; materialId: string}[],
}> {
    if (!body || typeof body !== 'object')
        throw new BadRequestException('corpo da requisição inválido');

    let { id, name, materials } = body as {
        id?: unknown,
        name?: unknown,
        materials?: unknown,
    }

    if (!id)
        throw new BadRequestException('o id do kit é obrigatório');

    if (typeof id !== 'string' || id.length !== 24)
        throw new BadRequestException('formato do id inválido');

    if (!name && !materials) {
        throw new BadRequestException('forneça ao menos um dos campos para atualizar: name, material');
    }

    if (name) {
        if (typeof name !== 'string' || name.length < 3)
            throw new BadRequestException('formato de nome inválido');
    }

    if (materials) {
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
    }


    return {
        id,
        name: name as string | undefined,
        materials: materials as {selectedQuantity: number; materialId: string}[] | undefined,
    };
}

export async function updateKitResponse(newKit: KitMongoDTO) {
    return {
        message: "Kit alterado com sucesso",
        kit: {
            id: newKit.id,
            name: newKit.name,
            materials: newKit.materials,
            origin: newKit.origin,
            userName: newKit.userName
        }
    };
}