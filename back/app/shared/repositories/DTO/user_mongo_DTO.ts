import { User } from "../../domain/entities/user";
import { toEnum } from "../../domain/enums/role";


export class UserMongoDTO{
    constructor(
        public user: User
    ){}
    
    static fromEntity(user: User) {
        return new UserMongoDTO(
            user
        )
    }

    // static toMongo(userDTO: UserMongoDTO) {
    //     return {
    //         name: userDTO.user.name,
    //         email: userDTO.user.email,
    //         role: userDTO.user.role as string,
    //         password: userDTO.user.password
    //     }
    // }

    // static fromMongo(userData: Record<string, string>): User {
    //     return User.fromJson({
    //         userId: userData["_id"],
    //         name: userData["name"],
    //         email: userData["email"],
    //         role: toEnum(userData["role"]),
    //         password: userData["password"]
    //     });
    // }
}
