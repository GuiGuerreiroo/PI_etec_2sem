import { Express, Request, Response } from "express";
import AuthPresenter from "../modules/user/auth/auth_presenter";
import CreateUserPresenter from "../modules/user/create_user/create_user_presenter";
import GetUserPresenter from "../modules/user/get_user/get_user_presenter";
import GetLaboratoriesStatus from "../modules/laboratory/get_laboratories_status/get_laboratories_status_presenter";
import GetHoursPresenter from "../modules/reservation/get_hours_status/get_hours_status_presenter";
import CreateMaterialPresenter from "../modules/material/create_material/create_material_presenter";
import CreateKitPresenter from "../modules/kit/create_kit/create_kit_presenter";
import CreateReservationPresenter from "../modules/reservation/create_reservation/create_reservation_presenter";
import GetKitsStatusPresenter from "../modules/kit/get_kits_status/get_kits_status_presenter";
import GetReservationPresenter from "../modules/reservation/get_reservation/get_reservation_presenter";
import GetAllUsersPresenter from "../modules/user/get_all_users/get_all_users_presenter";
import GetAllReservationsPresenter from "../modules/reservation/get_all_reservations/get_all_reservations_presenter";

export const routes = (app: Express) => {
  app
    .route("/")
    .get((req: Request, res: Response) =>
      res
        .status(200)
        .send("Api Reserva de Laboratórios de Química- Centro Paula Souza")
    );

  // user routes
  app.use("/api", AuthPresenter);
  app.use("/api", CreateUserPresenter);
  app.use("/api", GetUserPresenter);
  app.use("/api", GetAllUsersPresenter);

  // laboratory routes
  app.use("/api", GetLaboratoriesStatus);

  // material routes
  app.use("/api", CreateMaterialPresenter);

  // kit routes
  app.use("/api", CreateKitPresenter)
  app.use("/api", GetKitsStatusPresenter)

  // reservation routes

  // pegar status de hours
  app.use("/api", GetHoursPresenter);

  // create reservation
  app.use("/api", CreateReservationPresenter);

  // get reservation
  app.use("/api", GetReservationPresenter);

  // get all get all reservations
  app.use("/api", GetAllReservationsPresenter);
}
