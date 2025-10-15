import { Kit } from "../../domain/entities/kit";
import { ORIGIN } from "../../domain/enums/origin";
import { IKitRepository, KitUpdateOptions } from "../../domain/interface/IKitRepository";

export class KitRepositoryMock implements IKitRepository {
    private kits: Kit[] = [
        new Kit(
            "92306291-d379-415a-810a-199503f006c5",
            "Kit Química 1",
            {
                "3de12b09-592b-4c77-9899-9be5ffa0caf1": 2,
                "b08f81e4-a5ba-45a7-af2e-f64f7a826a10": 10,

            },
            ORIGIN.GENERAL
        ),
        new Kit(
            "587d7df9-6bf9-4851-bcb5-54fb752ef0a0",
            "Kit Química do Spiderman",
            {
                "7fda37d8-1cbb-4c57-a63c-b84ead277ed0": 3,
                "3de12b09-592b-4c77-9899-9be5ffa0caf1": 4
            },
            ORIGIN.INDIVIDUAL,
            "e5f4g6h6-6i7j-4k1l-88hh-i2j3k4l5m6n7"
        ),
    ];

    async createKit(kit: Kit): Promise<Kit> {
        this.kits.push(kit);
        return kit;
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