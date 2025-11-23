import { IKitRepository } from "../../../shared/domain/interface/IKitRepository";
import { BadRequestException } from "../../../shared/helpers/exceptions";
import { KitMongoDTO } from "../../../shared/repositories/database/mongo/kit_repository_mongo";

export interface GetAllKitsInput {
    requesterUserId: string;
    requesterUserRole: string;
}

export class GetAllKitsUseCase {
    constructor(
        private readonly kitRepo: IKitRepository,
    ) {}

    async execute({ requesterUserId, requesterUserRole }: GetAllKitsInput): Promise<KitMongoDTO[]> {
        let response: KitMongoDTO[]= [];

        if (requesterUserRole === "PROFESSOR") {
            const personalKits = await this.kitRepo.getKitByUserId(requesterUserId) || [];
            
            const kitsForEveryOne= await this.kitRepo.getKitsByOrigin("GERAL")|| [];

            response= personalKits.concat(kitsForEveryOne);
        }

        if (requesterUserRole === "MODERATOR" ) {
            response = await this.kitRepo.getKitsByOrigin("GERAL")||[];
        }

        if (requesterUserRole === "ADMIN" ) {
            response = await this.kitRepo.fetchKits();
        }

        if (response.length === 0)
            throw new BadRequestException("Nenhum kit encontrado");

        return response!;
    }
}