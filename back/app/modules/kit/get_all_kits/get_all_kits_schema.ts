import { KitMongoDTO } from "../../../shared/repositories/database/mongo/kit_repository_mongo";

export async function getAllKitsResponse(kits: KitMongoDTO[]) {
    return {
        message: "Kits retornados com sucesso",
        kit: kits.map((kit) => ({
            id: kit.id,
            name: kit.name,
            materials: kit.materials,
            origin: kit.origin,
            userName: kit.userName
        }))
    };
}