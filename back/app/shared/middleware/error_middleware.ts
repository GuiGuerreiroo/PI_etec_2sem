import { Request, Response, NextFunction } from "express";
import { BaseApplicationException } from "../helpers/exceptions";

export function errorHandlerMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof BaseApplicationException) {
    const status = err.statusCode || 500;

    if (err.details) {
      return res.status(status).json({ errors: err.details });
    }

    return res.status(status).json({ error: err.message });
  }

  return res.status(500).json({ error: "Erro interno do servidor" });
}