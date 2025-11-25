import { KitMongoDTO } from "../../repositories/database/mongo/kit_repository_mongo";
import { Kit } from "../entities/kit";

export type KitUpdateOptions = {
    name?: string;
    materials?: {selectedQuantity: number; materialId: string}[];
}

export interface IKitRepository {
    createKit(kit: Kit): Promise<KitMongoDTO>;

    fetchKits(): Promise<KitMongoDTO[]>;

    getKitById(kitId: string): Promise<KitMongoDTO | null>;

    getKitByUserId(userId: string): Promise<KitMongoDTO[] | null>;

    getKitsByOrigin(origin: string): Promise<KitMongoDTO[] | null>;

    // por enquanto nao sera usado
    // deleteKitById(kitId: string): Promise<KitMongoDTO | null>;

    updateKit(kitId: string, kitUpdateOptions: KitUpdateOptions): Promise<KitMongoDTO | null>;
}