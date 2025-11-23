import { Material } from "../entities/material";

export type MaterialUpdateOptions = {
    totalQuantity?: number,
    reusable?: boolean,
}

export interface IMaterialRepository {
    createMaterial(material: Material): Promise<Material>;

    fetchMaterials(): Promise<Material[]>;

    getMaterialById(materialId: string): Promise<Material | null>;

    //por enquanto nao sera usado
    // deleteMaterialById(materialId: string): Promise<Material | null>;

    updateMaterialQuantity(materialId: string, updateOptions: MaterialUpdateOptions): Promise<Material | null>;

    // serve para ajustar a quantidade de material, seja para aumentar ou diminuir
    adjustMaterialQuantity(materialId: string, amountToAdjust: number): Promise<Material | null>
}