import { Kit } from "../entities/kit";
import { HOUR } from "../enums/hours";

export type KitUpdateOptions = {
    name?: string;
    materialsIdList?: string[];
}

export interface IKitRepository {
    createKit(kit: Kit): Promise<Kit>;

    fetchKits(): Promise<Kit[]>;

    getKitById(kitId: string): Promise<Kit | null>;

    getKitByUserId(userId: string): Promise<Kit[] | null>;

    getKitsByOrigin(origin: string): Promise<Kit[] | null>;

    // getAvailableKits(date: string, idLab: string, hour: HOUR): Promise<Kit[]>;

    deleteKitById(kitId: string): Promise<Kit | null>;

    updateKit(kitId: string, kitUpdateOptions: KitUpdateOptions): Promise<Kit | null>;
}