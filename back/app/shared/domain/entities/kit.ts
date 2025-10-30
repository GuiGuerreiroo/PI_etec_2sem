import { ORIGIN } from "../enums/origin";

export class Kit {
    constructor(
        public name: string,
        public materials: {selectedQuantity: number; materialId: string}[],
        public origin: ORIGIN,
        public userId?: string,
        public kitId?: string,
    ) {}

    toJson(): {
        name: string;
        materials: {selectedQuantity: number; materialId: string}[];
        origin: ORIGIN;
        userId?: string;
        kitId?: string;
    } {
        return {
            name: this.name,
            materials: this.materials,
            origin: this.origin,
            userId: this.userId,
            kitId: this.kitId
        };
    }
    
    static fromJson(json: {
        name: string;
        materials: {selectedQuantity: number; materialId: string}[];
        origin: ORIGIN;
        userId?: string;
        kitId?: string;
    }): Kit {
        return new Kit(json.name, json.materials, json.origin, json.userId, json.kitId);
    }
}