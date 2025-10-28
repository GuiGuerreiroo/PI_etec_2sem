import { Kit } from "../../../domain/entities/kit";
import { Material } from "../../../domain/entities/material";
import { IKitRepository, KitUpdateOptions } from "../../../domain/interface/IKitRepository";
import { BadRequestException } from "../../../helpers/exceptions";
import { model, Schema, Types } from "mongoose";

export interface KitMongoDbInterface {
    name: string;
    materials: {selectedQuantity: number; materialId: string}[];
    origin: string;
    userId?: string;
} {}

const KitMongoSchema = new Schema({
    name: { type: String, required: true },
    materials: [{
      selectedQuantity: { type: Number, required: true },
      materialId: { type: String, required: true }
    }],
    origin: { type: String, required: true },
    userId: { type: String, required: false }
});

const KitMongo= model<KitMongoDbInterface>("Kit", KitMongoSchema);

export interface KitMongoDTO{
    id: string,
    name: string,
    materials: {selectedQuantity: number, material: Material}[],
    origin: string,
    userName?: string
}

async function KitMongoDTOFunction(kitId: string): Promise<KitMongoDTO> {
    const result= await KitMongo.aggregate<KitMongoDTO>([
        {$match: {
            "_id": new Types.ObjectId(kitId)
        }},
        {
            $lookup: {
                from: "Materials", //pode ser que seja Materials
                localField: "materials.materialId",
                foreignField: "_id",
                as: "materialsData"
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
                                            cond: {$eq: ["$$md._id", "$$mat.materialId"]}
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
                from: "Users",
                let: {userId: "$userId"},
                pipeline: [
                    {$match :
                        {
                            $expr:
                                {
                                    $and: [
                                        {$ne: ["$$userId", null]},
                                        { $eq: ["$_id", { $toObjectId: "$$userId" }] }
                                    ]
                                }                            
                        }
                
                    },
                    {
                        $project: {_id: 0, name: 1}
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
            $unset: ["materialsData", "userId", "userInfo"]
        }
    ]);
    
    return result[0];
}

export class KitRepoMongoDB implements IKitRepository {

    async createKit(kit: Kit): Promise<KitMongoDTO> {
        const createdKit= await KitMongo.create({
            name: kit.name,
            materials: kit.materials,
            origin: kit.origin,
            userId: kit.userId
        });
        
        const kitDTOModel= await KitMongoDTOFunction(createdKit.id);

        return kitDTOModel
    }
    
    async fetchKits(): Promise<Kit[]> {
        throw BadRequestException;
    }

    getKitById(kitId: string): Promise<Kit | null> {
        throw BadRequestException;
    }

    getKitByUserId(userId: string): Promise<Kit[] | null> {
        throw BadRequestException;
    }

    getKitsByOrigin(origin: string): Promise<Kit[] | null> {
        throw BadRequestException;
    }

    deleteKitById(kitId: string): Promise<Kit | null> {
        throw BadRequestException;
    }

    updateKit(kitId: string, kitUpdateOptions: KitUpdateOptions): Promise<Kit | null> {
        throw BadRequestException;
    }
}