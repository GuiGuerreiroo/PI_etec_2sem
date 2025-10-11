export class Kit {
    constructor(
        public kitId: string,
        public name: string
    ) {}

    toJson(): {
        kitId: string;
        name: string;
    } {
        return {
            kitId: this.kitId,
            name: this.name
        };
    }
    
    static fromJson(json: {
        kitId: string;
        name: string;
    }): Kit {
        return new Kit(json.kitId, json.name);
    }
}