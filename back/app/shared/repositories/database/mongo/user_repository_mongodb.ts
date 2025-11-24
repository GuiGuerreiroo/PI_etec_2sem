import { model, Schema } from "mongoose";
import { IUserRepository, UserUpdateOptions } from "../../../../shared/domain/interface/IUserRepository";
import { User } from "../../../../shared/domain/entities/user";
import { toEnum } from "../../../../shared/domain/enums/role";

export interface UserMongoDbInterface {
    name: string;
    email: string;
    role: string;
    password: string;
    isDeleted: boolean;
}

const UserMongoSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
});

const UserMongo = model<UserMongoDbInterface>("User", UserMongoSchema);

export class UserRepoMongoDB implements IUserRepository {

    async createUser(user: User): Promise<User> {

        const createdUser = await UserMongo.create({
            name: user.name,
            email: user.email,
            role: user.role,
            password: user.password,
            isDeleted: user.isDeleted
        });

        return User.fromJson({
            userId: createdUser._id.toString(),
            name: createdUser.name,
            email: createdUser.email,
            role: toEnum(createdUser.role),
            password: createdUser.password,
            isDeleted: createdUser.isDeleted
        });
    }

    async fetchUsers(): Promise<User[]> {
        const usersData = await UserMongo.find().exec();

        return usersData.map((userData) => User.fromJson({
            userId: userData._id.toString(),
            name: userData.name,
            email: userData.email,
            role: toEnum(userData.role),
            password: userData.password,
            isDeleted: userData.isDeleted
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
            password: userData.password,
            isDeleted: userData.isDeleted
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
            password: userData.password,
            isDeleted: userData.isDeleted
        });
    }

    async getAllProfessors(): Promise<User[]> {
        const professorsData = await UserMongo.find({ role: 'PROFESSOR' }).exec();

        return professorsData.map((professorData) => User.fromJson({
            userId: professorData._id.toString(),
            name: professorData.name,
            email: professorData.email,
            role: toEnum(professorData.role),
            password: professorData.password,
            isDeleted: professorData.isDeleted
        }));
    }

    async deleteUserById(userId: string): Promise<User | null> {
        const userData = await UserMongo.findByIdAndUpdate(
            userId,
            { isDeleted: true },
            { new: true }
        ).exec();

        if (!userData) {
            return null;
        }

        return User.fromJson({
            userId: userData._id.toString(),
            name: userData.name,
            email: userData.email,
            role: toEnum(userData.role),
            password: userData.password,
            isDeleted: userData.isDeleted
        });
    }

    async updateUser(userId: string, updateOptions: UserUpdateOptions): Promise<User | null> {
        const updatedUserData = await UserMongo.findByIdAndUpdate(
            userId,
            {
                ...updateOptions.name && { name: updateOptions.name },
                ...updateOptions.email && { email: updateOptions.email },
                ...updateOptions.role && { role: updateOptions.role },
                ...updateOptions.isDeleted !== undefined && { isDeleted: updateOptions.isDeleted },
            },
            { new: true }
        ).exec();

        if (!updatedUserData) {
            return null;
        }

        return User.fromJson({
            userId: updatedUserData._id.toString(),
            name: updatedUserData.name,
            email: updatedUserData.email,
            role: toEnum(updatedUserData.role),
            password: updatedUserData.password,
            isDeleted: updatedUserData.isDeleted
        });
    }
}
