import { Material } from "../../../shared/domain/entities/material";
import { BadRequestException } from "../../../shared/helpers/exceptions";

export async function updateMaterialRequestValidate(body: unknown): Promise<{ id: string; totalQuantity?: number, reusable?: boolean }> {
    if (!body || typeof body !== 'object') {
        throw new BadRequestException("request body inválido");
    }

    let { id, totalQuantity, reusable } = body as {
        id?: unknown;
        totalQuantity?: unknown
        reusable?: unknown
    };

    if (!id)
        throw new BadRequestException("o id do material é obrigatório");

    if (typeof id !== 'string' || id.length !== 24)
        throw new BadRequestException("formato de id inválido");

    if (!totalQuantity && !reusable)
        throw new BadRequestException("forneça ao menos um dos campos para atualizar: totalQuantity, reusable");

    if (totalQuantity) {
        if (typeof totalQuantity !== 'number' || totalQuantity < 1) {
            throw new BadRequestException("quantidade total inválida");
        }
    }

    if (reusable) {
        if (typeof reusable !== 'boolean') {
            throw new BadRequestException("formato de reutilizável inválido");
        }
    }

    return {
        id,
        totalQuantity: totalQuantity as number | undefined,
        reusable: reusable as boolean | undefined,
    };
}

export async function updateMaterialResponse(updatedMaterial: Material) {
    return {
        message: "Material atualizado com sucesso",
        material: {
            id: updatedMaterial.materialId,
            name: updatedMaterial.name,
            reusable: updatedMaterial.reusable,
            totalQuantity: updatedMaterial.totalQuantity,
            size: updatedMaterial.size,
        }
    }
}