import { Material } from "../../../shared/domain/entities/material";
import { IMaterialRepository, MaterialUpdateOptions } from "../../../shared/domain/interface/IMaterialRepository";
import { NotFoundException } from "../../../shared/helpers/exceptions";

interface UpdateMaterialInputInterface {
    id: string;
    updateOptions: MaterialUpdateOptions;
}

export class UpdateMaterialUseCase {
    constructor(private materialRepository: IMaterialRepository) {}

    async execute({id, updateOptions}: UpdateMaterialInputInterface): Promise<Material> {
        const updatedMaterial= await this.materialRepository.updateMaterialQuantity(id, updateOptions);

        if (!updatedMaterial) {
            throw new NotFoundException("Material não encontrado");
        }

        return updatedMaterial;
    }
}