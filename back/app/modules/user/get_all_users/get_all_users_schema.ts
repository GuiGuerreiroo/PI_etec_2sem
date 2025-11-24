import { User } from "../../../shared/domain/entities/user";

export async function getAllUsersResponse(users: User[]) {
    return {
        message: "Usuários retornados com sucesso",
        users: users.map((user) => ({
                id: user.userId,
                name: user.name,
                role: user.role,
                email: user.email,
                isDeleted: user.isDeleted,
        }))
    }
}