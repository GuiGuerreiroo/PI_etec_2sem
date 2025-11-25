import { Env } from "../../env";
import { IKitRepository } from "../domain/interface/IKitRepository";
import { ILaboratoryRepository } from "../domain/interface/ILaboratoryRepository";
import { IMaterialRepository } from "../domain/interface/IMaterialRepository";
import { IReservationRepository } from "../domain/interface/IReservationRepository";
import { IUserRepository } from "../domain/interface/IUserRepository"
import { KitRepoMongoDB } from "./database/mongo/kit_repository_mongo";
import { LaboratoryRepoMongoDB } from "./database/mongo/laboratory_repository_mongo";
import { MaterialRepoMongoDB } from "./database/mongo/material_repository_mongo";
import { ReservationRepoMongoDB } from "./database/mongo/reservation_repository_mongo";
import { UserRepoMongoDB } from "./database/mongo/user_repository_mongodb";
import { KitRepoMock } from "./mock/kit_repository_mock";
import { LaboratoryRepoMock } from "./mock/laboratory_repository_mock";
import { MaterialRepoMock } from "./mock/material_repository_mock";
import { ReservationRepoMock } from "./mock/reservation_repository_mock";
import { UserRepoMock } from "./mock/user_repository_mock";

export class UserRepository {
    public userRepo: IUserRepository;

    constructor() {
        if (Env.STAGE === "error") {
            console.log("You need to add a .env in you main folder contin the stage you want to interact")
        }
        if (Env.STAGE === "test") {
            this.userRepo = new UserRepoMock()
        }
        else {
            // A conexão já foi estabelecida no server.ts
            this.userRepo = new UserRepoMongoDB();
        }
    }
}

export class LabRepository {
    public laboratoryRepo: ILaboratoryRepository;
    public reservationRepo: IReservationRepository;

    constructor() {
        if (Env.STAGE === "error") {
            console.log("You need to add a .env in you main folder contin the stage you want to interact")
        }
        if (Env.STAGE === "test") {
            this.laboratoryRepo = new LaboratoryRepoMock()
            this.reservationRepo = new ReservationRepoMock()
        }
        else {
            this.laboratoryRepo = new LaboratoryRepoMongoDB();
            this.reservationRepo = new ReservationRepoMongoDB()
        }
    }
}

export class MaterialRepository {
    public materialRepo: IMaterialRepository;

    constructor() {
        if (Env.STAGE === "error") {
            console.log("You need to add a .env in you main folder containing the stage you want to interact")
        }
        if (Env.STAGE === "test") {
            this.materialRepo = new MaterialRepoMock()
        }
        else {
            // A conexão já foi estabelecida no server.ts
            this.materialRepo = new MaterialRepoMongoDB();
        }
    }
}

export class KitRepository {
    public kitRepo: IKitRepository;
    public materialRepo: IMaterialRepository;
    public reservationRepo: IReservationRepository;

    constructor() {
        if (Env.STAGE === "error") {
            console.log("You need to add a .env in you main folder containing the stage you want to interact")
        }
        if (Env.STAGE === "test") {
            this.kitRepo = new KitRepoMock();
            this.materialRepo = new MaterialRepoMock()
            this.reservationRepo= new ReservationRepoMock()
        }
        else {
            // A conexão já foi estabelecida no server.ts
            this.kitRepo = new KitRepoMongoDB()
            this.materialRepo = new MaterialRepoMongoDB();
            this.reservationRepo= new ReservationRepoMongoDB()
        }
    }
}

export class ReservationRepository {
    public reservationRepo: IReservationRepository;
    public laboratoryRepo: ILaboratoryRepository;
    public kitRepo: IKitRepository;
    public materialRepo: IMaterialRepository;

    constructor() {
        if (Env.STAGE === "error") {
            console.log("You need to add a .env in you main folder containing the stage you want to interact")
        }
        if (Env.STAGE === "test") {
            this.reservationRepo = new ReservationRepoMock();
            this.laboratoryRepo = new LaboratoryRepoMock();
            this.kitRepo = new KitRepoMock();
            this.materialRepo = new MaterialRepoMock()
        }
        else {
            this.reservationRepo = new ReservationRepoMongoDB()
            this.laboratoryRepo = new LaboratoryRepoMongoDB()
            this.kitRepo = new KitRepoMongoDB();
            this.materialRepo = new MaterialRepoMongoDB();
        }
    }
}