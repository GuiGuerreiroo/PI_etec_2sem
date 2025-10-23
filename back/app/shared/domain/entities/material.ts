export class Material {
    constructor(
        public materialId: string,
        public name: string,
        public reusable: boolean,
        public quantity: number,
        public size?: string
    ) {}

    toJson() : {
        materialId: string;
        name: string;
        reusable: boolean;
        quantity: number;
        size?: string;
    } {
        return {
            materialId: this.materialId,
            name: this.name,
            reusable: this.reusable,
            quantity: this.quantity,
            size: this.size
        }
    }

    static fromJson(json: {
        materialId: string;
        name: string;
        reusable: boolean;
        quantity: number;
        size?: string;
    }) {
        return new Material(json.materialId, json.name, json.reusable, json.quantity, json.size);
    }
}
