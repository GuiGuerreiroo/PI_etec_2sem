import { Laboratory } from "../../domain/entities/laboratory";
import { ILaboratoryRepository } from "../../domain/interface/ILaboratoryRepository";

export class LaboratoryRepoMock implements ILaboratoryRepository {
    private laboratories: Laboratory[] = [
        new Laboratory(
            "128d890b-2740-4176-b6d0-5d07b365e7af",
            "Lab de Química 1"
        ),
        new Laboratory(
            "d99b317a-bb11-4859-bee2-1223bb5a6560",
            "Lab de Quimica 2"
        ),
        new Laboratory(
            "864f60dd-135e-4397-992b-e35dad801304",
            "Lab de Física 3"
        ),
    ];

    async createLaboratory(laboratory: Laboratory): Promise<Laboratory> {
        this.laboratories.push(laboratory);
        return laboratory;
    }

    async fetchLaboratories(): Promise<Laboratory[]> {
        return this.laboratories;
    }

    async getLaboratoryById(labId: string): Promise<Laboratory | null> {
        return this.laboratories.find((lab) => lab.labId === labId) || null;
    }

    async deleteLaboratoryById(labId: string): Promise<Laboratory | null> {
        const index = this.laboratories.findIndex((lab) => lab.labId === labId);

        if (index === -1) {
            return null
        }

        return this.laboratories.splice(index, 1)[0];
    }
}