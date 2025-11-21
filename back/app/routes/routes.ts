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
import UpdateReservationPresenter from "../modules/reservation/update_reservation/update_reservation_presenter";
import GetAllKitsPresenter from "../modules/kit/get_all_kits/get_all_kits_presenter";
import GetAllMaterialsPresenter from "../modules/material/get_all_materials/get_all_materials_presenter";
import DeleteUserPresenter from "../modules/user/delete_user/delete_user_presenter";
import UpdateUserPresenter from "../modules/user/update_user/update_user_presenter";

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
  app.use("/api", DeleteUserPresenter);
  app.use("/api", UpdateUserPresenter);

  // laboratory routes
  app.use("/api", GetLaboratoriesStatus);

  // material routes

  // create material
  app.use("/api", CreateMaterialPresenter);

  // get all materials
  app.use("/api", GetAllMaterialsPresenter);

  // kit routes

  // create kit
  app.use("/api", CreateKitPresenter)

  // get kits status
  app.use("/api", GetKitsStatusPresenter)

  // get all kits
  app.use("/api", GetAllKitsPresenter)

  // reservation routes

  // pegar status de hours
  app.use("/api", GetHoursPresenter);

  // create reservation
  app.use("/api", CreateReservationPresenter);

  // get reservation
  app.use("/api", GetReservationPresenter);

  // get all get all reservations
  app.use("/api", GetAllReservationsPresenter);

  // update reservation
  app.use("/api", UpdateReservationPresenter);
}
