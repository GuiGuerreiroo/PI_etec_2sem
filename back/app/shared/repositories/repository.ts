import { Env } from "../../env";
import { ILaboratoryRepository } from "../domain/interface/ILaboratoryRepository";
import { IReservationRepository } from "../domain/interface/IReservationRepository";
import { IUserRepository } from "../domain/interface/IUserRepository"
import { MongoDBResources } from "./database/mongo/mongo_datasource";
import { LaboratoryRepoMock } from "./mock/laboratory_repository_mock";
import { ReservationRepoMock } from "./mock/reservation_repository_mock";
import { UserRepoMock } from "./mock/user_repository_mock";

export class UserRepository {
    public userRepo: IUserRepository;
    // private mongoDb?: MongoDBResources;

    constructor(){
        if(Env.STAGE === "error"){
            console.log("You need to add a .env in you main folder contin the stage you want to interact")
        }
        if (Env.STAGE === "test") {
            this.userRepo= new UserRepoMock()
        } 
        // AQUI DEVE SE CONFIGURAR O MONGO, por enquanto esta com o default
        else {
            // this mongoDB=  new MongoDBResources();
            // this.userRepo= new UserRepositoryMongoDB(this.mongoDb);
            this.userRepo= new UserRepoMock()
        }
    }
}

export class LabRepository {
    public laboratoryRepo: ILaboratoryRepository;
    public reservationRepo: IReservationRepository;
    // private mongoDb?: MongoDBResources;

    constructor(){
        if(Env.STAGE === "error"){
            console.log("You need to add a .env in you main folder contin the stage you want to interact")
        }
        if (Env.STAGE === "test") {
            this.laboratoryRepo= new LaboratoryRepoMock()
            this.reservationRepo= new ReservationRepoMock()
        } 
        // AQUI DEVE SE CONFIGURAR O MONGO, por enquanto esta com o default
        else {
            // this mongoDB=  new MongoDBResources();
            // this.userRepo= new UserRepositoryMongoDB(this.mongoDb);
            this.laboratoryRepo= new LaboratoryRepoMock()
            this.reservationRepo= new ReservationRepoMock()
        }
    }
}

export class ReservationRepository {
    public laboratoryRepo: ILaboratoryRepository;
    public reservationRepo: IReservationRepository;
    // private mongoDb?: MongoDBResources;

    constructor(){
        if(Env.STAGE === "error"){
            console.log("You need to add a .env in you main folder containing the stage you want to interact")
        }
        if (Env.STAGE === "test") {
            this.reservationRepo= new ReservationRepoMock()

            this.laboratoryRepo= new LaboratoryRepoMock()
        } 
        // AQUI DEVE SE CONFIGURAR O MONGO, por enquanto esta com o default
        else {
            // this mongoDB=  new MongoDBResources();
            // this.userRepo= new UserRepositoryMongoDB(this.mongoDb);
            this.reservationRepo= new ReservationRepoMock()

            this.laboratoryRepo= new LaboratoryRepoMock()
        }
    }
}