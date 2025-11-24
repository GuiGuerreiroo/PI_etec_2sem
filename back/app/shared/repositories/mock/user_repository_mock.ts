import { ROLE } from "../../../shared/domain/enums/role";
import { User } from "../../domain/entities/user";
import { IUserRepository, UserUpdateOptions } from "../../domain/interface/IUserRepository";

export class UserRepoMock implements IUserRepository {
  private users: User[] = [
    new User(
      "Matuê",
      "matue@etec.com.br",
      ROLE.ADMIN,
      "$2b$10$SJ9aNkxAcoIK0WA2sBP3oekHgylrKR4YcA4SXlqFNJC9D59yleJXG",
      false,
      "7a181d51-4f96-4d97-81b9-16e08aa63742"
    ),
    new User(
      "Zinedine Zidane",
      "zidane@etec.com.es",
      ROLE.MODERATOR,
      "#Cabecada2006",
      false,
      "e9c7d747-9e8e-4d34-935e-473c2c16be83"
    ),
    new User(
      "Roberto Carlos",
      "robertinho@etec.com.br",
      ROLE.MODERATOR,
      "Perdeu-Perna1900",
      true,
      "a1c6d2e2-9b5a-45d0-98ef-cd25d582a2d3",
    ),
    new User(
      "Nuncio Perrela",
      "nuncio@etec.br",
      ROLE.PROFESSOR,
      "Nuncio123",
      false,
      "b5c1d3e3-9c2b-46d1-97ee-c2d5d582a2d4"
    ),
    new User(
      "Peter Parker",
      "spiderman@etec.br",
      ROLE.PROFESSOR,
      "$2b$10$SJ9aNkxAcoIK0WA2sBP3oekHgylrKR4YcA4SXlqFNJC9D59yleJXG",
      false,
      "e5f4g6h6-6i7j-4k1l-88hh-i2j3k4l5m6n7"
    ),

  ];

  async createUser(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async fetchUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.users.find((user) => user.userId === userId) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async getAllProfessors(): Promise<User[]> {
    return this.users.filter((user) => user.role === ROLE.PROFESSOR);
  }

  async deleteUserById(userId: string): Promise<User | null> {
    const index= this.users.findIndex((user) => user.userId === userId);
    
    if (index === -1){
      return null
    }
    
    return this.users.splice(index, 1)[0];
  }

  async updateUser(userId: string, updateOptions: UserUpdateOptions): Promise<User | null> {
    const user = this.users.find((user) => user.userId === userId);

    if (!user) {
      return null;
    }

    if (updateOptions.name !== undefined) {
      user.name = updateOptions.name;
    }
    if (updateOptions.email !== undefined) {
      user.email = updateOptions.email;
    }
    if (updateOptions.role !== undefined) {
      user.role = updateOptions.role;
    }

    return user;
  }
}
