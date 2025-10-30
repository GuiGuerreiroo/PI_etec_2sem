import { KitMongoDTO } from "../../../shared/repositories/database/mongo/kit_repository_mongo";
import { IKitRepository } from "../../../shared/domain/interface/IKitRepository";
import { IMaterialRepository } from "../../../shared/domain/interface/IMaterialRepository";
import { BadRequestException } from "../../../shared/helpers/exceptions";
import { ORIGIN } from "../../../shared/domain/enums/origin";
import { Kit } from "../../../shared/domain/entities/kit";

export interface CreateKitInterface {
    name: string;
    materials: {selectedQuantity: number; materialId: string}[];
    userId?: string;
}

export class CreateKitUseCase {
    constructor(
        private readonly kitRepository: IKitRepository,
        private readonly materialRepository: IMaterialRepository,
    ) {}

    async execute({name, materials, userId}: CreateKitInterface): Promise<KitMongoDTO> {

        for(const material of materials){
            const existingMaterial= await this.materialRepository.getMaterialById(material.materialId);

            console.log(existingMaterial);

            if (!existingMaterial) 
                throw new BadRequestException("Algum dos materiais selecionados não está no banco");

            if (material.selectedQuantity > existingMaterial.totalQuantity){
                throw new BadRequestException(`A quantidade selecionada do material ${existingMaterial.name} é maior do que a disponível no estoque`);
            }
        }

        // nao fiz a validacao do userFromToken porque para se gerar o token ja tem validacao para saber se ele esta no banco
        let originEnum: ORIGIN;

        if (!userId)
            originEnum= ORIGIN.GENERAL;

        else
            originEnum= ORIGIN.INDIVIDUAL;
        

        const newKit= new Kit(
            name,
            materials,
            originEnum,
            userId
        );

        const createdKit= await this.kitRepository.createKit(newKit);

        return createdKit;
    }
}