import { Material } from "../../../shared/domain/entities/material";

export async function getAllMaterialsResponse(materials: Material[]){
    return {
        message: "Materiais retornados com sucesso",
        material: materials.map((material) => ({
            id: material.materialId,
            name: material.name,
            reusable: material.reusable,
            totalQuantity: material.totalQuantity,
            size: material.size,
        }))
    }
}