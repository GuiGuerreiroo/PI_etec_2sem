export class Laboratory {
    constructor(
        public idLab: string,
        public name: string
    ) {}


    toJson(): {
        idLab: string;
        name: string;
    }   {
        return {
            idLab: this.idLab,
            name: this.name
        };
    }

    static fromJson(json: {
        idLab: string;
        name: string;
    }): Laboratory {
        return new Laboratory(json.idLab, json.name);
    }
}