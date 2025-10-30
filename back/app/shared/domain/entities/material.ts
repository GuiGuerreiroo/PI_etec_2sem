export class Material {
    constructor(
        public name: string,
        public reusable: boolean,
        public totalQuantity: number,
        public size?: string,
        public materialId?: string
    ) {}

    toJson() : {
        name: string;
        reusable: boolean;
        totalQuantity: number;
        size?: string;
        materialId?: string;
    } {
        return {
            name: this.name,
            reusable: this.reusable,
            totalQuantity: this.totalQuantity,
            size: this.size,
            materialId: this.materialId
        }
    }

    static fromJson(json: {
        name: string;
        reusable: boolean;
        totalQuantity: number;
        size?: string;
        materialId?: string;
    }): Material {
        return new Material(json.name, json.reusable, json.totalQuantity, json.size, json.materialId);
    }
}
