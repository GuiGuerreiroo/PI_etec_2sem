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

    // Se a exceção tiver detalhes
    if (err.details) {
      return res.status(status).json({ errors: err.details });
    }

    // Senão, devolve apenas a mensagem
    return res.status(status).json({ error: err.message });
  }

  // Erro não tratado
  return res.status(500).json({ error: "Erro interno do servidor" });
}