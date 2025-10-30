import { Kit } from "../../../domain/entities/kit";
import { Material } from "../../../domain/entities/material";
import { IKitRepository, KitUpdateOptions } from "../../../domain/interface/IKitRepository";
import { model, Schema, Types } from "mongoose";

export interface KitMongoDbInterface {
    name: string;
    materials: {selectedQuantity: number; materialId: Types.ObjectId}[];
    origin: string;
    userId?: string;
} {}

const KitMongoSchema = new Schema({
    name: { type: String, required: true },
    materials: [{
      selectedQuantity: { type: Number, required: true },
      materialId: { type: Types.ObjectId, required: true, ref: 'materials' }
    }],
    origin: { type: String, required: true },
    userId: { type: Types.ObjectId, required: false, ref: 'users' }
});

const KitMongo= model<KitMongoDbInterface>("Kit", KitMongoSchema);

export interface KitMongoDTO{
    id: string,
    name: string,
    materials: {selectedQuantity: number, material: Material}[],
    origin: string,
    userName?: string
}

async function KitMongoDTOFunction(kitId: Types.ObjectId): Promise<KitMongoDTO> {
    const result= await KitMongo.aggregate<KitMongoDTO>([
        {$match: {
            "_id": kitId
        }},
        {
            $lookup: {
                from: "materials",
                localField: "materials.materialId",
                foreignField: "_id",
                as: "materialsData",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                        }
                    }
                ]
            },
        },
        {
            $addFields: {
                materials: {
                    $map: {
                        input: "$materials",
                        as: "mat",
                        in: {
                            selectedQuantity: "$$mat.selectedQuantity",

                            material: {
                               $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: "$materialsData",
                                            as: "md",
                                            cond: {$eq: ["$$md._id", "$$mat.materialId" ]}
                                        } 
                                    },
                                    //para pegar o item 0 do array retornado
                                    0
                               ] 
                            }
                        }
                    }
                }
            }
        },
        {
            $lookup: {
                from: "users",
                let: {userId: "$userId"},
                pipeline: [
                    {$match :
                        {
                            $expr:
                                {
                                    $and: [
                                        {$ne: ["$$userId", null]},
                                        { $eq: ["$_id", "$$userId"] }
                                    ]
                                }                            
                        }
                
                    }
                ],
                as: "userInfo"
            }
        },
        {   
            // retira a lista que foi criada com o lookup de users e so pega o campo name
            $addFields: {
                userName: {$arrayElemAt: ["$userInfo.name", 0]}
            }
        },
        {
            $project: {
                _id: 0,
                id: {"$toString": "$_id"},
                name: 1,
                materials: {
                    $map: {
                        input: "$materials", 
                        as: "m",
                        in: {
                            selectedQuantity: "$$m.selectedQuantity",
                            material: {
                                materialId: {"$toString": "$$m.material._id"}, //adicionando para testar
                                name: "$$m.material.name",
                                reusable: "$$m.material.reusable",
                                totalQuantity: "$$m.material.totalQuantity",
                                size: "$$m.material.size"
                            }
                        }
                    }
                },
                origin: 1,
                userName: 1
            }
        }
    ]);

    return result[0];
}

export class KitRepoMongoDB implements IKitRepository {

    async createKit(kit: Kit): Promise<KitMongoDTO> {
        const createdKit= await KitMongo.create({
            name: kit.name,
            materials: kit.materials.map((materials) => ({
                selectedQuantity: materials.selectedQuantity,
                materialId: new Types.ObjectId(materials.materialId)
            })),
            origin: kit.origin,
            userId: kit.userId ? new Types.ObjectId(kit.userId) : undefined,
        });

        const kitDTOModel= await KitMongoDTOFunction(createdKit._id);

        return kitDTOModel;
    }
    
    async fetchKits(): Promise<KitMongoDTO[]> {
        const kitsData= await KitMongo.find().exec();

        return await Promise.all(kitsData.map(async (kitData) => {
            return await KitMongoDTOFunction(kitData._id);
        }));
    }

    async getKitById(kitId: string): Promise<KitMongoDTO | null> {
        const kitDataDTO= await KitMongoDTOFunction(new Types.ObjectId(kitId));

        if (!kitDataDTO)
            return null;

        return kitDataDTO
    }

    async getKitByUserId(userId: string): Promise<KitMongoDTO[] | null> {
        const kitsData = await KitMongo.find({ userId: new Types.ObjectId(userId) }).exec();

        if (kitsData.length === 0) {
            return null;
        }

        return await Promise.all(kitsData.map(async (kitData) => {
            return await KitMongoDTOFunction(kitData._id);
        }));
    }

    async getKitsByOrigin(origin: string): Promise<KitMongoDTO[] | null> {
        const kitsData = await KitMongo.find({ origin: origin }).exec();

        if (kitsData.length === 0) {
            return null;
        }

        return await Promise.all(kitsData.map(async (kitData) => {
            return await KitMongoDTOFunction(kitData._id);
        }));
    }

    async deleteKitById(kitId: string): Promise<KitMongoDTO | null> {
        const kitData= await KitMongo.findByIdAndDelete(kitId).exec();

        if (!kitData) {
            return null;
        }

        return await KitMongoDTOFunction(kitData._id);
    }

    async updateKit(kitId: string, kitUpdateOptions: KitUpdateOptions): Promise<KitMongoDTO | null> {
        const kitData= await KitMongo.findByIdAndUpdate(
            new Types.ObjectId(kitId),
            {
                ...(kitUpdateOptions.name && {name: kitUpdateOptions.name}),
                ...(kitUpdateOptions.materials && {
                    materials: kitUpdateOptions.materials.map((material) => ({
                        selectedQuantity: material.selectedQuantity,
                        materialId: new Types.ObjectId(material.materialId)
                    }))
                })
            },
        ).exec();

        if (!kitData) {
            return null;
        }

        return await KitMongoDTOFunction(kitData._id);
    }
}