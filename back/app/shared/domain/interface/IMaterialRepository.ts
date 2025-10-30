import { Material } from "../entities/material";


export interface IMaterialRepository {
    createMaterial(material: Material): Promise<Material>;

    fetchMaterials(): Promise<Material[]>;

    getMaterialById(materialId: string): Promise<Material | null>;

    deleteMaterialById(materialId: string): Promise<Material | null>;

    updateMaterialQuantity(materialId: string, selectedQuantity: number): Promise<Material | null>;

    // serve para ajustar a quantidade de material, seja para aumentar ou diminuir
    adjustMaterialQuantity(materialId: string, amountToAdjust: number): Promise<Material | null>
}