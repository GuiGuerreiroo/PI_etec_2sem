import { ROLE } from "../enums/role";


export class User {
  constructor(
    public name: string,
    public email: string,
    public role: ROLE,
    public password: string,
    public isDeleted: boolean = false,
    public userId?: string,
  ) {}

  toJson() : {
    name: string;
    email: string;
    role: ROLE;
    password: string;
    isDeleted: boolean;
    userId?: string;
  } {
    return {
      name: this.name,
      email: this.email,
      role: this.role,
      password: this.password,
      isDeleted: this.isDeleted,
      userId: this.userId,
    };
  }

  static fromJson(json: {
    name: string;
    email: string;
    role: ROLE;
    password: string;
    isDeleted: boolean;
    userId?: string;
  }): User {
    return new User(json.name, json.email, json.role, json.password, json.isDeleted, json.userId);
  }
}
