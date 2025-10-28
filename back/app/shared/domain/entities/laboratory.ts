export class Laboratory {
    constructor(
        public labId: string,
        public name: string
    ) { }


    toJson(): {
        labId: string;
        name: string;
    } {
        return {
            labId: this.labId,
            name: this.name
        };
    }

    static fromJson(json: {
        labId: string;
        name: string;
    }): Laboratory {
        return new Laboratory(json.labId, json.name);
    }
}