import { model, Schema } from "mongoose";
import { IUserRepository } from "../../../../shared/domain/interface/IUserRepository";
import { User } from "../../../../shared/domain/entities/user";
import { UserMongoDTO } from "../../DTO/user_mongo_DTO";
import { toEnum } from "../../../../shared/domain/enums/role";

export interface UserMongoDbInterface {
    name: string;
    email: string;
    role: string;
    password: string;
}

const UserMongoSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: { type: String, required: true }
});

const UserMongo = model<UserMongoDbInterface>("User", UserMongoSchema);



export class UserRepoMongoDB implements IUserRepository {

    async createUser(user: User): Promise<User> {
        const userDTO = UserMongoDTO.fromEntity(user);

        const createdUser = await UserMongo.create({
            name: userDTO.user.name,
            email: userDTO.user.email,
            role: userDTO.user.role,
            password: userDTO.user.password
        });

        return User.fromJson({
            userId: createdUser._id.toString(),
            name: createdUser.name,
            email: createdUser.email,
            role: toEnum(createdUser.role),
            password: createdUser.password
        });
    }

    async fetchUsers(): Promise<User[]> {
        const usersData = await UserMongo.find().exec();

        return usersData.map(userData => User.fromJson({
            userId: userData._id.toString(),
            name: userData.name,
            email: userData.email,
            role: toEnum(userData.role),
            password: userData.password
        }));
    }

    async getUserById(userId: string): Promise<User | null> {
        const userData = await UserMongo.findById(userId).exec();

        if (!userData) {
            return null;
        }

        return User.fromJson({
            userId: userData._id.toString(),
            name: userData.name,
            email: userData.email,
            role: toEnum(userData.role),
            password: userData.password
        });
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const userData = await UserMongo.findOne({ email: email}).exec();

        if (!userData) {
            return null;
        }

        return User.fromJson({
            userId: userData._id.toString(),
            name: userData.name,
            email: userData.email,
            role: toEnum(userData.role),
            password: userData.password
        });
    }

    async deleteUserById(userId: string): Promise<User | null> {
        const userData = await UserMongo.findByIdAndDelete(userId).exec();

        if (!userData) {
            return null;
        }

        return User.fromJson({
            userId: userData._id.toString(),
            name: userData.name,
            email: userData.email,
            role: toEnum(userData.role),
            password: userData.password
        });
    }

}
