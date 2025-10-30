import { Material } from "../../../shared/domain/entities/material";
import { BadRequestException } from "../../../shared/helpers/exceptions";

export async function createMaterialRequestValidate(body: unknown): Promise<{name: string, reusable: boolean, totalQuantity: number, size?: string}>{
    if (!body || typeof body !== 'object')
        throw new BadRequestException('request body inválido');

    const {name, reusable, totalQuantity, size} = body as {
        name: unknown;
        reusable: unknown;
        totalQuantity: unknown;
        size: unknown;
    }

    if (typeof name !== 'string' || name.length < 3)
        throw new BadRequestException('formato de nome inválido');

    if (typeof reusable !== 'boolean')
        throw new BadRequestException('formato de reutilizável inválido');

    if (typeof totalQuantity !== 'number' || totalQuantity < 1)
        throw new BadRequestException('quantidade deve ser um número maior que 0');

    if (size !== undefined && (typeof size !== 'string' || size.length < 1))
        throw new BadRequestException('formato de tamanho inválido');

    return {name, reusable, totalQuantity, size}
}

export async function createMaterialResponse(newMaterial: Material){
    return {
        message: "Material criado com sucesso",
        material: {
            id: newMaterial.materialId,
            name: newMaterial.name,
            reusable: newMaterial.reusable,
            totalQuantity: newMaterial.totalQuantity,
            size: newMaterial.size,
        }
    }
}