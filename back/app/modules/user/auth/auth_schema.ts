import { BadRequestException } from "../../../shared/helpers/exceptions";


export async function authRequestValidate(body: unknown): Promise<{ email: string; password: string }> {
    if (!body || typeof body !== 'object'){
        throw new BadRequestException('request body inválido');
    }

    const { email, password } = body as { email: unknown; password: unknown };

    if (typeof email !== 'string' || !email.includes('@etec'))
        throw new BadRequestException('formato do email inválido');

    if (typeof password !== 'string' || password.length < 6)
        throw new BadRequestException('senha deve ter pelo menos 6 caracteres');

    return { email, password };
}