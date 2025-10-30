import { Material } from "../../../../shared/domain/entities/material";
import { Reservation } from "../../../../shared/domain/entities/resevation";
import { IReservationRepository, ReservationFilterOptions, ReservationUpdateOptions } from "../../../../shared/domain/interface/IReservationRepository";
import { model, Schema, Types } from "mongoose";

interface ReservationMongoDbInterface {
    date: string;
    hour: string;
    labId: Types.ObjectId;
    userId: Types.ObjectId;
    status: string;
    kitId: Types.ObjectId;
}

const ReservationMongoSchema = new Schema({
    date: { type: String, required: true },
    hour: { type: String, required: true },
    labId: { type: Types.ObjectId, required: true, ref: 'labs' },
    userId: { type: Types.ObjectId, required: true, ref: 'users' },
    status: { type: String, required: true },
    kitId: { type: Types.ObjectId, required: true, ref: 'kits' }
});

const ReservationMongo = model<ReservationMongoDbInterface>("Reservation", ReservationMongoSchema);

export interface ReservationMongoDTO {
    id: string,
    date: string,
    hour: string,
    labName: string,
    userName: string,
    status: string,
    kit: {
        name: string,
        materials: { selectedQuantity: number, material: Material }[],
        origin: string,
        userName?: string
    }
}

async function ReservationMongoDTOFunction(reservationId: Types.ObjectId): Promise<ReservationMongoDTO> {
    const result = await ReservationMongo.aggregate<ReservationMongoDTO>([
        {
            $match: {
                "_id": reservationId
            }
        },
        {
            $lookup: {
                from: "laboratories",
                localField: "labId",
                foreignField: "_id",
                as: "laboratoryData"
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData"
            },
        },
        {
            $lookup: {
                from: "kits",
                localField: "kitId",
                foreignField: "_id",
                as: "kitData",
            }
        },
        {
            $unwind: {
                path: "$kitData",
                preserveNullAndEmptyArrays: true
            }

        },
        {
            $lookup: {
                from: "materials",
                localField: "kitData.materials.materialId",
                foreignField: "_id",
                as: "materialsData"
            },
        },
        {
            $addFields: {
                materials: {
                    $map: {
                        input: "$kitData.materials",
                        as: "mat",
                        in: {
                            selectedQuantity: "$$mat.selectedQuantity",

                            material: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: "$materialsData",
                                            as: "md",
                                            cond: { $eq: ["$$md._id", "$$mat.materialId"] }
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
                let: { userId: "$kitData.userId" },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and: [
                                    { $ne: ["$$userId", null] },
                                    { $eq: ["$_id", "$$userId"] }
                                ]
                            }
                        }

                    }
                ],
                as: "kitUserInfo"
            }
        },
        {
            $project: {
                _id: 0,
                id: { "$toString": "$_id" },
                date: 1,
                hour: 1,
                labName: { $arrayElemAt: ["$laboratoryData.name", 0] },
                userName: { $arrayElemAt: ["$userData.name", 0] },
                status: 1,
                kit: {
                    name: "$kitData.name",
                    materials: {
                        $map: {
                            input: "$materials",
                            as: "m",
                            in: {
                                selectedQuantity: "$$m.selectedQuantity",
                                material: {
                                    name: "$$m.material.name",
                                    reusable: "$$m.material.reusable",
                                    totalQuantity: "$$m.material.totalQuantity",
                                    size: "$$m.material.size"
                                }
                            }
                        }
                    },
                    origin: "$kitData.origin",
                    userName: { $arrayElemAt: ["$kitUserInfo.name", 0] }
                }
            }
        }
    ]);

    return result[0];
}

export class ReservationRepoMongoDB implements IReservationRepository {
    async createReservation(reservation: Reservation): Promise<ReservationMongoDTO> {
        const createdReservation = await ReservationMongo.create({
            date: reservation.date,
            hour: reservation.hour,
            labId: new Types.ObjectId(reservation.labId),
            userId: new Types.ObjectId(reservation.userId),
            status: reservation.status,
            kitId: new Types.ObjectId(reservation.kitId)
        });

        const reservationDTOModel = await ReservationMongoDTOFunction(createdReservation._id);

        return reservationDTOModel;
    }

    async fetchReservations(): Promise<ReservationMongoDTO[]> {
        const reservationsData = await ReservationMongo.find().exec();

        return await Promise.all(reservationsData.map(async (reservationData) => {
            return await ReservationMongoDTOFunction(reservationData._id);
        }));
    }

    async getReservationById(reservationId: string): Promise<ReservationMongoDTO | null> {
        const reservationDataDTO = await ReservationMongoDTOFunction(new Types.ObjectId(reservationId));

        if (!reservationDataDTO)
            return null;

        return reservationDataDTO;
    }

    async getReservationsByFilter(filter: ReservationFilterOptions): Promise<ReservationMongoDTO[] | null> {
        const reservationsData = await ReservationMongo.find(
            {
                ...filter.date && { date: filter.date },
                ...filter.hour && { hour: filter.hour },
                ...filter.labId && { labId: new Types.ObjectId(filter.labId) },
                ...filter.userId && { userId: new Types.ObjectId(filter.userId) },
                ...filter.status && { status: filter.status },
            }
        ).exec();

        if (reservationsData.length === 0)
            return null;

        return await Promise.all(reservationsData.map(async (reservationData) => {
            return await ReservationMongoDTOFunction(reservationData._id);
        }));
    }


    async deleteReservationById(reservationId: string): Promise<ReservationMongoDTO | null> {
        const deletedReservation = await ReservationMongo.findByIdAndDelete(reservationId).exec();

        if (!deletedReservation) {
            return null;
        }

        return await ReservationMongoDTOFunction(deletedReservation._id);
    }

    async updateReservationStatus(reservationId: string, reservationUpdateOptions: ReservationUpdateOptions): Promise<ReservationMongoDTO | null> {
        throw new Error("Method not implemented.");
    }
}