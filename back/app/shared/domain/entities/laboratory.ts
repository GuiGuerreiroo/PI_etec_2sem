export class Laboratory {
    constructor(
        public name: string,
        public labId?: string
    ) { }


    toJson(): {
        name: string;
        labId?: string;
    } {
        return {
            name: this.name,
            labId: this.labId
        };
    }

    static fromJson(json: {
        name: string;
        labId: string;
    }): Laboratory {
        return new Laboratory(json.name, json.labId);
    }
}