import { Laboratory } from "../entities/laboratory";

export interface ILaboratoryRepository {
    createLaboratory(laboratory: Laboratory): Promise<Laboratory>;

    fetchLaboratories(): Promise<Laboratory[]>;

    getLaboratoryById(labId: string): Promise<Laboratory | null>;

    deleteLaboratoryById(labId: string): Promise<Laboratory | null>;

    // acho que o update n vai ser necessario
}