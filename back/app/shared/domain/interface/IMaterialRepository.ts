import { Material } from "../entities/material";


export interface IMaterialRepository {
    createMaterial(material: Material): Promise<Material>;

    fetchMaterials(): Promise<Material[]>;

    getMaterialById(materialId: string): Promise<Material | null>;

    deleteMaterialById(materialId: string): Promise<Material | null>;

    updateMaterialQuantity(materialId: string, quantity: number): Promise<Material | null>;
}