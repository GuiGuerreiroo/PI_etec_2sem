import { Material } from "../../domain/entities/material";
import { IMaterialRepository } from "../../domain/interface/IMaterialRepository";

export class MaterialRepoMock implements IMaterialRepository {
    private materials: Material[] = [
        new Material(
            "3de12b09-592b-4c77-9899-9be5ffa0caf1",
            "Beker de vidro",
            true,
            10,
            "250ml"
        ),
        new Material(
            "7fda37d8-1cbb-4c57-a63c-b84ead277ed0",
            "Beker de vidro",
            true,
            20,
            "100ml"
        ),
        new Material(
            "914ed099-3896-4c50-8f99-90782190b877",
            "Pipeta de vidro",
            true,
            15,
            "25ml"
        ),
        new Material(
            "b08f81e4-a5ba-45a7-af2e-f64f7a826a10",
            "Cloreto de sódio",
            false,
            50
        ),
    ];

    async createMaterial(material: Material): Promise<Material> {
        this.materials.push(material);
        return material;
    }

    async fetchMaterials(): Promise<Material[]> {
        return this.materials;
    }

    async getMaterialById(materialId: string): Promise<Material | null> {
        return this.materials.find((material) => material.materialId === materialId) || null;
    }

    async deleteMaterialById(materialId: string): Promise<Material | null> {
        const index= this.materials.findIndex((material) => material.materialId === materialId)

        if (index === -1){
            return null
        }
        
        return this.materials.splice(index, 1)[0]
    }
    // testar o update
    async updateMaterialQuantity(materialId: string, quantity: number): Promise<Material | null> {
        const material= this.materials.find((material) => material.materialId === materialId)|| null;

        if (material === null){
            return null
        }

        Object.assign(material, {quantity})

        return material
    }
}