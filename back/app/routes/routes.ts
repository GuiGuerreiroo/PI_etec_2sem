import { Express, Request, Response } from "express";


export const routes = (app: Express) => {
  app
    .route("/")
    .get((req: Request, res: Response) =>
      res
        .status(200)
        .send("Api Reserva de Laboratórios de Química- Centro Paula Souza")
    );
}
