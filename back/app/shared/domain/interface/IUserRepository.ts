import { User } from "../entities/user";

// export type UserUpdateOptions = {
//   name?: string,
//   email?: string,
//   role?: ROLE,
//   password?: string 
// }

export interface IUserRepository {
    createUser(user: User): Promise<User>;

    fetchUsers(): Promise<User[]>;

    getUserById(userId: string): Promise<User | null>;

    getUserByEmail(email: string): Promise<User | null>;

    deleteUserById(userId: string): Promise<User | null>;

    // ver se vamos usar

    // updateUser(userId: string, updateOptions: UserUpdateOptions): Promise<User | null>;
}