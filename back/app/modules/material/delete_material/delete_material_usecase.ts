import { Material } from "../../../shared/domain/entities/material";
import { IMaterialRepository } from "../../../shared/domain/interface/IMaterialRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";

export class DeleteMaterialUseCase {
    constructor(private materialRepository: IMaterialRepository) {}

    async execute( id : string ): Promise<Material> {
        const deletedMaterial = await this.materialRepository.deleteMaterialById(id);

        if (deletedMaterial === null) {
            throw new NotFoundException("Material não encontrado");
        }

        return deletedMaterial;
    }
}