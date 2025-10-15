import { ROLE } from "../../../shared/domain/enums/role";
import { User } from "../../domain/entities/user";
import { IUserRepository } from "../../domain/interface/IUserRepository";

export class UserRepoMock implements IUserRepository {
  private users: User[] = [
    new User(
      "7a181d51-4f96-4d97-81b9-16e08aa63742",
      "Matuê",
      "matue@30praum.com.br",
      ROLE.ADMIN,
      "matue30"
    ),
    new User(
      "e9c7d747-9e8e-4d34-935e-473c2c16be83",
      "Zinedine Zidane",
      "zidane@realmadrid.com.es",
      ROLE.MODERATOR,
      "#Cabecada2006"
    ),
    new User(
      "a1c6d2e2-9b5a-45d0-98ef-cd25d582a2d3",
      "Roberto Carlos",
      "robertinho@globo.com.br",
      ROLE.MODERATOR,
      "Perdeu-Perna1900"
    ),
    new User(
      "b5c1d3e3-9c2b-46d1-97ee-c2d5d582a2d4",
      "Nuncio Perrela",
      "nunfio@maua.br",
      ROLE.PROFESSOR,
      "ProjetoDuCaralho123"
    ),
    new User(
      "e5f4g6h6-6i7j-4k1l-88hh-i2j3k4l5m6n7",
      "Peter Parker",
      "spiderman@maua.br",
      ROLE.PROFESSOR,
      "Spiderman2002"
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

  async deleteUserById(userId: string): Promise<User | null> {
    const index= this.users.findIndex((user) => user.userId === userId);
    
    if (index === -1){
      return null
    }
    
    return this.users.splice(index, 1)[0];
  }
}
