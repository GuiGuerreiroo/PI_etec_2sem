import { model, Schema } from "mongoose";
import { ILaboratoryRepository } from "../../../../shared/domain/interface/ILaboratoryRepository";
import { Laboratory } from "../../../../shared/domain/entities/laboratory";

export interface LaboratoryMongoDbInterface {
    name: string;
}

const LabMongoSchema = new Schema({
    name: { type: String, required: true },
})

const LabMongo = model<LaboratoryMongoDbInterface>("Laboratory", LabMongoSchema)


export class LaboratoryMongoDB implements ILaboratoryRepository {
    async getLaboratoryById(labId: string): Promise<Laboratory | null> {
        const labData = await LabMongo.findById(labId).exec();

        if (!labData)
            return null;

        return Laboratory.fromJson({
            labId: labData._id.toString(),
            name: labData.name
        });
    }

    async fetchLaboratories(): Promise<Laboratory[]> {
        const labsData = await LabMongo.find().exec();

        return labsData.map((labData) => Laboratory.fromJson({
            labId: labData._id.toString(),
            name: labData.name
        }))
    }
}