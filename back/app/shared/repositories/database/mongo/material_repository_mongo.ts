import { Material } from "../../../../shared/domain/entities/material";
import { IMaterialRepository, MaterialUpdateOptions } from "../../../../shared/domain/interface/IMaterialRepository";
import { model, Schema, Types } from "mongoose"

export interface MaterialMongoDbInterface {
    name: string,
    reusable: boolean,
    totalQuantity: number,
    size?: string
}

const MaterialMongoSchema= new Schema({
    name: {type: String, require: true},
    reusable: {type: Boolean, require: true},
    totalQuantity: {type: Number, require: true},
    size: {type: String, require: false}
});

const MaterialMongo= model<MaterialMongoDbInterface>("Material", MaterialMongoSchema);

export class MaterialRepoMongoDB implements IMaterialRepository{
    
    async createMaterial(material: Material): Promise<Material> {
        const createMaterial= await MaterialMongo.create({
            name: material.name,
            reusable: material.reusable,
            totalQuantity: material.totalQuantity,
            size: material.size
        });

        return Material.fromJson({
            materialId: createMaterial._id.toString(),
            name: createMaterial.name,
            reusable: createMaterial.reusable,
            totalQuantity: createMaterial.totalQuantity,
            size: createMaterial.size
        });
    }

    async fetchMaterials(): Promise<Material[]> {
        const materialsData= await MaterialMongo.find().exec();

        return materialsData.map((materialData) => Material.fromJson({
            materialId: materialData._id.toString(),
            name: materialData.name,
            reusable: materialData.reusable,
            totalQuantity: materialData.totalQuantity,
            size: materialData.size
        }));
    }

    async getMaterialById(materialId: string): Promise<Material | null> {
        const materialData= await MaterialMongo.findById(materialId).exec();

        if (!materialData)
            return null;

        return Material.fromJson({
            materialId: materialData._id.toString(),
            name: materialData.name,
            reusable: materialData.reusable,
            totalQuantity: materialData.totalQuantity,
            size: materialData.size
        });
    }

    async deleteMaterialById(materialId: string): Promise<Material | null> {
        const materialData= await MaterialMongo.findByIdAndDelete(materialId).exec();

        if (!materialData)
            return null;

        return Material.fromJson({
            materialId: materialData._id.toString(),
            name: materialData.name,
            reusable: materialData.reusable,
            totalQuantity: materialData.totalQuantity,
            size: materialData.size
        });
    }

    async updateMaterialQuantity(materialId: string, updateOptions: MaterialUpdateOptions): Promise<Material | null> {
        console.log(materialId)

        const materialData= await MaterialMongo.findByIdAndUpdate(
            materialId,
            {
                ...updateOptions.totalQuantity && { totalQuantity: updateOptions.totalQuantity },
                ...updateOptions.reusable && { reusable: updateOptions.reusable },
            },
            { new: true }
        ).exec();

        console.log(materialData);

        if(materialData === null)
            return null

        return Material.fromJson({
            materialId: materialData._id.toString(),
            name: materialData.name,
            reusable: materialData.reusable,
            totalQuantity: materialData.totalQuantity,
            size: materialData.size
        });
    }

    async adjustMaterialQuantity(materialId: string, amountToAdjust: number): Promise<Material | null> {
    console.log(materialId)
    const materialData = await MaterialMongo.findByIdAndUpdate(
        new Types.ObjectId(materialId),
        { $inc: { totalQuantity: amountToAdjust } },
        
        { new: true }
    ).exec();

    console.log(materialData);

    if(materialData === null)
        return null;

    return Material.fromJson({
        materialId: materialData._id.toString(),
        name: materialData.name,
        reusable: materialData.reusable,
        totalQuantity: materialData.totalQuantity,
        size: materialData.size
    });
}

}