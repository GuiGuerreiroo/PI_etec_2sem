import { Env } from "back/app/env";
import { IUserRepository } from "../domain/interface/IUserRepository"
import { MongoDBResources } from "./database/mongo/mongo_datasource";
import { UserRepoMock } from "./mock/user_repository_mock";

export class UserRepository {
    public userRepo: IUserRepository;
    private mongoDb?: MongoDBResources;

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