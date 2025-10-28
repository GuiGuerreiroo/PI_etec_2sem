import { Kit } from "../../domain/entities/kit";
import { ORIGIN } from "../../domain/enums/origin";
import { IKitRepository, KitUpdateOptions } from "../../domain/interface/IKitRepository";
import { BadRequestException } from "../../helpers/exceptions";
import { KitMongoDTO } from "../database/mongo/kit_repository_mongo";

export class KitRepoMock implements IKitRepository {
    private kits: Kit[] = [
        new Kit(
            "Kit Química 1",
            [
                {
                    selectedQuantity: 2,
                    materialId: "3de12b09-592b-4c77-9899-9be5ffa0caf1"
                },
                {
                    selectedQuantity: 10,
                    materialId: "b08f81e4-a5ba-45a7-af2e-f64f7a826a10"
                }
            ],
            ORIGIN.GENERAL,
            "92306291-d379-415a-810a-199503f006c5",
        ),
        new Kit(
            "Kit Química do Spiderman",
            [
                {
                    selectedQuantity: 3,
                    materialId: "7fda37d8-1cbb-4c57-a63c-b84ead277ed0"
                },
                {
                    selectedQuantity: 4,
                    materialId: "3de12b09-592b-4c77-9899-9be5ffa0caf1"
                }
            ],
            ORIGIN.INDIVIDUAL,
            "e5f4g6h6-6i7j-4k1l-88hh-i2j3k4l5m6n7",
            "587d7df9-6bf9-4851-bcb5-54fb752ef0a0"
        ),
    ];

    async createKit(kit: Kit): Promise<KitMongoDTO> {
        throw BadRequestException;
    }

    async fetchKits(): Promise<Kit[]> {
        return this.kits;
    }

    async getKitById(kitId: string): Promise<Kit | null> {
        return this.kits.find((kit) => kit.kitId === kitId) || null;
    }

    async getKitByUserId(userId: string): Promise<Kit[] | null> {
        return this.kits.filter((kit) => kit.userId === userId) || null;
    }

    async getKitsByOrigin(origin: ORIGIN): Promise<Kit[] | null> {
        return this.kits.filter((kit) => kit.origin === origin) || null;
    }

    async deleteKitById(kitId: string): Promise<Kit | null> {
        const index = this.kits.findIndex((kit) => kit.kitId === kitId);

        if (index === -1) {
            return null;
        }

        return this.kits.splice(index, 1)[0];
    }

    async updateKit(kitId: string, kitUpdateOptions: KitUpdateOptions): Promise<Kit | null> {
        const kit= this.kits.find((kit) => kit.kitId === kitId) || null;

        if (kit === null) {
            return null;
        }

        Object.assign(kit, kitUpdateOptions);

        return kit;
    }
}