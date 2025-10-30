import { Material } from "../../../shared/domain/entities/material";
import { IMaterialRepository } from "../../../shared/domain/interface/IMaterialRepository";

interface CreateMaterialInterface {
    name: string;
    reusable: boolean;
    totalQuantity: number;
    size?: string;
}

export class CreateMaterialUseCase {
    constructor(private readonly materialRepository: IMaterialRepository) {}

    async execute({name, reusable, totalQuantity, size}: CreateMaterialInterface): Promise<Material>{
        // ver se preciso validar de alguma forma como saber se o material ja existe
        const newMaterial= new Material(
            name,
            reusable,
            totalQuantity,
            size
        );

        const createdMaterial= await this.materialRepository.createMaterial(newMaterial);

        return createdMaterial;
    }
}