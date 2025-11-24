import jwt from "jsonwebtoken";

export class JWToken {

  static encode(
    userId: string | object,
    role: string,
    expDays: number = 1,
    expHours: number = 0,
    expMinutes: number = 0,
    jwtSecret: string = process.env.JWT_SECRET as string
  ): string {
    const exp = Math.floor(
      (Date.now() +
        expDays * 24 * 60 * 60 * 1000 +
        expHours * 60 * 60 * 1000 +
        expMinutes * 60 * 1000) /
        1000
    );

    const payload: any = {
      id: userId,
      role: role,
      exp: exp,
    };
    return jwt.sign(payload, jwtSecret, { algorithm: "HS256" });
  }

  static decode(
    accessToken: string,
    jwtSecret: string = process.env.JWT_SECRET as string
  ): string | object | false {
    try {
      const decoded = jwt.verify(accessToken, jwtSecret, {
        algorithms: ["HS256"],
      }) as any;
      return decoded.user_id;
    } catch (e) {
      return false;
    }
  }

  static refreshToken(
    refreshToken: string,
    jwtSecret: string = process.env.JWT_SECRET as string,
    expDays: number = 1
  ): string {
    const decoded = jwt.verify(refreshToken, jwtSecret, { algorithms: ["HS256"] }) as any;
    const userId = decoded.user_id;
    const role = decoded.role;
    return JWToken.encode(userId as string, role as string, expDays, 0, 0, jwtSecret);
  }
}
