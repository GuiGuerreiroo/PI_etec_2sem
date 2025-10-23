import { Express, Request, Response } from "express";
import AuthPresenter from "../modules/user/auth/auth_presenter";
import CreateUserPresenter from "../modules/user/create_user/create_user_presenter";
import GetUserPresenter from "../modules/user/get_user/get_user_presenter";
import GetLaboratoriesStatus from "../modules/laboratory/get_laboratories_status/get_laboratories_status_presenter";

export const routes = (app: Express) => {
  app
    .route("/")
    .get((req: Request, res: Response) =>
      res
        .status(200)
        .send("Api Reserva de Laboratórios de Química- Centro Paula Souza")
    );

  app.use("/api", AuthPresenter);
  app.use("/api", CreateUserPresenter);
  app.use("/api", GetUserPresenter);
  app.use("/api", GetLaboratoriesStatus);
}
