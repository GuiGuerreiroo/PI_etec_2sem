import { BadRequestException } from "../../../shared/helpers/exceptions";

export async function deleteMaterialRequestValidate(body: unknown): Promise<{ id: string }> {
    if (!body || typeof body !== "object") {
        throw new BadRequestException("Parâmetros de requisição inválidos");
    }

    const { id } = body as { id: unknown };

    if (typeof id !== "string" || id.length !== 24) {
        throw new BadRequestException("ID do material inválido");
    }

    return { id };
}

export async function deleteMaterialResponse() {
    return {
        message: "Material deletado com sucesso",
    };
}