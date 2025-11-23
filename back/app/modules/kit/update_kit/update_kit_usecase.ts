import { IKitRepository, KitUpdateOptions } from "../../../shared/domain/interface/IKitRepository";
import { IMaterialRepository } from "../../../shared/domain/interface/IMaterialRepository";
import { BadRequestException, ForbiddenException, NotFoundException } from "../../../shared/helpers/exceptions";

interface UpdateKitInputInterface {
    id: string;
    updateOptions: KitUpdateOptions;
    isAdminOrModerator: boolean;
}

export class UpdateKitUseCase {
    constructor(
        private readonly kitRepository: IKitRepository,
        private readonly materialRepository: IMaterialRepository,
    ) {}

    async execute({id, updateOptions, isAdminOrModerator}: UpdateKitInputInterface) {
        const existingKit= await this.kitRepository.getKitById(id);

        if (!existingKit)
            throw new NotFoundException("Kit não encontrado");

        if (existingKit.origin === "GERAL" && !isAdminOrModerator) {
            throw new ForbiddenException("Kits de origem GERAL só podem ser alterados por ADMIN ou MODERATOR");
        }

        if (existingKit.origin === "INDIVIDUAL" && isAdminOrModerator) {
            throw new ForbiddenException("Kits de origem INDIVIDUAL não podem ser alterados por ADMIN ou MODERATOR");
        }

        if (updateOptions.materials) {
            for(const material of updateOptions.materials){
                const existingMaterial= await this.materialRepository.getMaterialById(material.materialId);

                console.log(existingMaterial);

                if (!existingMaterial) 
                    throw new BadRequestException("Algum dos materiais selecionados não está no banco");

                if (material.selectedQuantity > existingMaterial.totalQuantity) {
                    throw new BadRequestException(`A quantidade selecionada do material ${existingMaterial.name} é maior do que a disponível no estoque ou inválida`);
                }
            }
        }

        const updatedKit= await this.kitRepository.updateKit(id, updateOptions);

        return updatedKit!;
    }
}