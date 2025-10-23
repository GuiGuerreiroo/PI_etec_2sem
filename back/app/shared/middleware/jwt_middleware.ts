import { Request as ExpressRequest, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { InternalServerErrorException, UnauthorizedException } from "../helpers/exceptions";

export type UserFromToken = {
  id: string;
  email: string;
  role: string;
  status: string;
  iat: number;
  exp: number;
};

declare module "express" {
  interface Request {
    user?: UserFromToken;
  }
}

export function authenticateToken(
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Received token:", token);

  if (!token) {
    console.log("Token not provided");
    return next(new UnauthorizedException("Token not provided"));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as UserFromToken;

    if (!decoded) {
      console.log("Token verification failed");
      return next(new UnauthorizedException("Invalid token"));
    }

    console.log("User from token:", decoded);
    req.user = decoded;
    next();
  } catch (error: any) {
    console.log("Error decoding token:", error);

    if (error.name === "JsonWebTokenError") {
      return next(new UnauthorizedException("Invalid token"));
    } else if (error.name === "TokenExpiredError") {
      return next(new UnauthorizedException("Invalid token: expired"));
    } else if (error.name === "NotBeforeError") {
      return next(new UnauthorizedException("Invalid token: not active yet"));
    }

    return next(new InternalServerErrorException("Internal Server Error"));
  }
}
