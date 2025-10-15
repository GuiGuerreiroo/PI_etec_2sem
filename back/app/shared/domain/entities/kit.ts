import { ORIGIN } from "../enums/origin";

export class Kit {
    constructor(
        public kitId: string,
        public name: string,
        public materialsIdList: Record<string, number>,
        public origin: ORIGIN,
        public userId?: string
    ) {}

    toJson(): {
        kitId: string;
        name: string;
        materialsIdList: Record<string, number>;
        origin: ORIGIN;
        userId?: string;
    } {
        return {
            kitId: this.kitId,
            name: this.name,
            materialsIdList: this.materialsIdList,
            origin: this.origin,
            userId: this.userId
        };
    }
    
    static fromJson(json: {
        kitId: string;
        name: string;
        materialsIdList: Record<string, number>;
        origin: ORIGIN;
        userId?: string;
    }): Kit {
        return new Kit(json.kitId, json.name, json.materialsIdList, json.origin, json.userId);
    }
}