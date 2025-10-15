import { Reservation } from "../entities/resevation";

export type ReservationFilterOptions = {
    date?: string,
    hour?: string
    idLab?: string,
    idUser?: string,
    status?: string;
}

export type ReservationUpdateOptions = {
    idLab?: string,
    status?: string;
}

export interface IReservationRepository{
    createReservation(reservation: Reservation): Promise<Reservation>;

    fetchReservations(): Promise<Reservation[]>;

    getReservationById(reservationId: string): Promise<Reservation | null>;

    getReservationByFilter(filter: ReservationFilterOptions): Promise<Reservation[] | null>;

    deleteReservationById(reservationId: string): Promise<Reservation | null>;

    updateReservationStatus(reservationId: string, reservationUpdateOptions: ReservationUpdateOptions): Promise<Reservation | null>;
}