import { Material } from "../../../shared/domain/entities/material";
import { IMaterialRepository } from "../../../shared/domain/interface/IMaterialRepository";

export class GetAllMaterialsUseCase {
    constructor(private materialRepository: IMaterialRepository) {}

    async execute(): Promise<Material[]> {
        const materials= await this.materialRepository.fetchMaterials();
        
        return materials;
    }
}