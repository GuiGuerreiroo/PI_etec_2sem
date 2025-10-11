import { ROLE } from "../enums/role";


export class User {
  constructor(
    public userId: string,
    public name: string,
    public email: string,
    public role: ROLE,
    public password: string
  ) {}

  toJson() : {
    userId: string;
    name: string;
    email: string;
    role: ROLE;
    password: string;
  } {
    return {
    userId: this.userId,
    name: this.name,
    email: this.email,
    role: this.role,
    password: this.password,
    };
  }

  static fromJson(json: {
    userId: string;
    name: string;
    email: string;
    role: ROLE;
    password: string;
    PK?: string;
    SK?: string;
  }): User {
    return new User(json.userId, json.name, json.email, json.role, json.password);
  }
}
