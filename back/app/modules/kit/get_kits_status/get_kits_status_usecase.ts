import { HOUR } from "../../../shared/domain/enums/hours";
import { IKitRepository } from "../../../shared/domain/interface/IKitRepository";
import { IReservationRepository } from "../../../shared/domain/interface/IReservationRepository";
import { KitMongoDTO } from "../../../shared/repositories/database/mongo/kit_repository_mongo";

interface GetKitsStatusInput {
    date: string;
    hour: HOUR;
    userId: string;
}

export interface GetKitsStatusResponseInterface {
    kit: KitMongoDTO,
    available: boolean
}

export class GetKitsStatusUseCase {
    constructor(
        private readonly kitRepo: IKitRepository,
        private readonly reservationRepo: IReservationRepository,
    ) { }

    async execute({ date, hour, userId }: GetKitsStatusInput): Promise<GetKitsStatusResponseInterface[]> {
        // lab nao foi validado porque nao é usado para nada aqui

        const reservationsScheduled = await this.reservationRepo.getReservationsByFilter({ date: date, hour: hour, status: "MARCADO" });


        if (reservationsScheduled === null) {
            let kitsForEveryOne = await this.kitRepo.getKitsByOrigin("GERAL");

            if (!kitsForEveryOne)
                kitsForEveryOne = [];

            let kitsForSpecificUser = await this.kitRepo.getKitByUserId(userId)

            if (!kitsForSpecificUser)
                kitsForSpecificUser = [];

            const allKitsAvailable = kitsForEveryOne.concat(kitsForSpecificUser);

            return allKitsAvailable.map((kit) => ({
                kit: kit,
                available: true
            }));
        }

        else {
            const reservedMaterialsMap = reservationsScheduled.reduce((acc, reservation) => {
                reservation.kit.materials.forEach((selectedMaterial) => {
                    const material = selectedMaterial.material

                    const key = `${material.name}-${material.size}`;

                    const existingMaterial = acc.get(key)

                    if (existingMaterial) {
                        if (material.reusable === true)
                            existingMaterial.selectedQuantity += selectedMaterial.selectedQuantity

                        // ignoramos se o reusable === false, pois pegaremos somente o totalQuantity
                    }
                    else {
                        acc.set(
                            key,
                            {
                                name: material.name,
                                selectedQuantity: selectedMaterial.selectedQuantity,
                                totalQuantity: material.totalQuantity,
                                reusable: material.reusable,
                                size: material.size
                            }
                        );
                    }
                })
                return acc;
            }, new Map())

            let kitsForEveryOne = await this.kitRepo.getKitsByOrigin("GERAL");

            if (!kitsForEveryOne)
                kitsForEveryOne = [];

            let kitsForSpecificUser = await this.kitRepo.getKitByUserId(userId)

            if (!kitsForSpecificUser)
                kitsForSpecificUser = [];

            const allKits = kitsForEveryOne.concat(kitsForSpecificUser);

            const allKitsStatus = allKits.map((kit) => {
                const isKitAvailable = kit.materials.every((selectedMaterial) => {
                    const materialInfo = selectedMaterial.material;
                    const quantitySelected = selectedMaterial.selectedQuantity;
                    const totalQuantity = selectedMaterial.material.totalQuantity;

                    const key = `${materialInfo.name}-${materialInfo.size}`

                    const existingMaterialdata = reservedMaterialsMap.get(key)

                    if (existingMaterialdata) {
                        if (existingMaterialdata.selectedQuantity >= existingMaterialdata.totalQuantity || existingMaterialdata.totalQuantity === 0 || ((existingMaterialdata.selectedQuantity + quantitySelected) > existingMaterialdata.totalQuantity)) {
                            return false
                        }
                        else {
                            return true
                        }
                    }
                    else {
                        if (quantitySelected > totalQuantity) {
                            return false
                        }
                        else {
                            return true
                        }
                    }
                })
                const kitModel = kit
                return {
                    kit: kitModel,
                    available: isKitAvailable
                }
            })

            return allKitsStatus
        }
    }
}