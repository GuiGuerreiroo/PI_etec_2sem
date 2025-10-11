export class Material {
    constructor(
        public materialId: string,
        public name: string,
        public reusable: boolean,
        public quantity: number
    ) {}

    toJson() : {
        materialId: string;
        name: string;
        reusable: boolean;
        quantity: number;
    } {
        return {
            materialId: this.materialId,
            name: this.name,
            reusable: this.reusable,
            quantity: this.quantity
        }
    }

    static fromJson(json: {
        materialId: string;
        name: string;
        reusable: boolean;
        quantity: number;
    }) {
        return new Material(json.materialId, json.name, json.reusable, json.quantity);
    }
}
