import { ReservationMongoDTO } from "../../repositories/database/mongo/reservation_repository_mongo";
import { Reservation } from "../entities/resevation";
import { HOUR } from "../enums/hours";

export type ReservationFilterOptions = {
    date?: string,
    hour?: HOUR,
    labId?: string,
    userId?: string,
    status?: string;
}

export type ReservationUpdateOptions = {
    labId?: string,
    status?: string;
}

export interface IReservationRepository {
    createReservation(reservation: Reservation): Promise<ReservationMongoDTO>;

    fetchReservations(): Promise<ReservationMongoDTO[]>;

    getReservationById(reservationId: string): Promise<ReservationMongoDTO | null>;

    getReservationsByFilter(filter: ReservationFilterOptions): Promise<ReservationMongoDTO[] | null>;

    deleteReservationById(reservationId: string): Promise<ReservationMongoDTO | null>;

    updateReservationStatus(reservationId: string, reservationUpdateOptions: ReservationUpdateOptions): Promise<ReservationMongoDTO | null>;
}