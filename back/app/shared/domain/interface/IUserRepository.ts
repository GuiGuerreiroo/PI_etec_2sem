import { User } from "../entities/user";
import { ROLE } from "../enums/role";

export type UserUpdateOptions = {
  name?: string,
  email?: string,
  role?: ROLE,
}

export interface IUserRepository {
    createUser(user: User): Promise<User>;

    fetchUsers(): Promise<User[]>;

    getUserById(userId: string): Promise<User | null>;

    getUserByEmail(email: string): Promise<User | null>;

    deleteUserById(userId: string): Promise<User | null>;

    updateUser(userId: string, updateOptions: UserUpdateOptions): Promise<User | null>;
}