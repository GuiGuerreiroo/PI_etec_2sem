import bcrypt from "bcrypt";

export class Encrypt {
    static async hashPassword(password: string): Promise<string> {
        const salt= await bcrypt.genSalt(10);

        return bcrypt.hash(password, salt);
    }

    static async verifyPassword(password: string, hashPassword: string): Promise<boolean>{
        return bcrypt.compare(password, hashPassword)
    }
        
}