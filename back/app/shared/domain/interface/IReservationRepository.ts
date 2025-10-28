import { Reservation } from "../entities/resevation";
import { HOUR } from "../enums/hours";

export type ReservationFilterOptions = {
    date?: string,
    hour?: HOUR,
    labId?: string,
    idUser?: string,
    status?: string;
}

export type ReservationUpdateOptions = {
    labId?: string,
    status?: string;
}

export interface IReservationRepository {
    createReservation(reservation: Reservation): Promise<Reservation>;

    fetchReservations(): Promise<Reservation[]>;

    getReservationById(reservationId: string): Promise<Reservation | null>;

    getReservationByFilter(filter: ReservationFilterOptions): Promise<Reservation[] | null>;

    // getAvailableHour(date: string, labId: string): Promise<HOUR[]>;

    deleteReservationById(reservationId: string): Promise<Reservation | null>;

    updateReservationStatus(reservationId: string, reservationUpdateOptions: ReservationUpdateOptions): Promise<Reservation | null>;
}