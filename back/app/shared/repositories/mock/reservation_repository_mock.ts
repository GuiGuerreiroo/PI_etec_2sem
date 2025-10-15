import { Reservation } from "../../domain/entities/resevation";
import { STATUS } from "../../domain/enums/status";
import { ReservationFilterOptions, ReservationUpdateOptions } from "../../domain/interface/IReservationRepository";

export class ReservationRepositoryMock {
    private reservations: Reservation[] = [
        new Reservation(
            "387b1a2c-a9a6-4851-9cf7-8d84cb24339a",
            "15/09/2025",
            "7:10",
            "128d890b-2740-4176-b6d0-5d07b365e7af",//Lab Química 1
            "b5c1d3e3-9c2b-46d1-97ee-c2d5d582a2d4",//Nuncio
            STATUS.COMPLETED,
            "92306291-d379-415a-810a-199503f006c5"//Kit Química 1
        ),
        new Reservation(
            "f674012b-c6d4-45e7-b319-c7044c57a602",
            "15/09/2025",
            "7:10",
            "d99b317a-bb11-4859-bee2-1223bb5a6560",//Lab Química 2
            "e5f4g6h6-6i7j-4k1l-88hh-i2j3k4l5m6n7",//Peter Parker
            STATUS.SCHEDULED,
            "587d7df9-6bf9-4851-bcb5-54fb752ef0a0"//Kit Química do Spiderman
        ),
        new Reservation(
            "53705239-99c1-46c5-b131-5aa4650e40e9",
            "18/09/2025",
            "13:30",
            "864f60dd-135e-4397-992b-e35dad801304",//Lab Física 3
            "b5c1d3e3-9c2b-46d1-97ee-c2d5d582a2d4",
            STATUS.SCHEDULED,
            "92306291-d379-415a-810a-199503f006c5"//Kit Química 1
        )
    ];

    async createReservation(reservation: Reservation): Promise<Reservation> {
        this.reservations.push(reservation);
        return reservation;
    }

    async fetchReservations(): Promise<Reservation[]> {
        return this.reservations;
    }
    
    async getReservationById(reservationId: string): Promise<Reservation | null> {
        return this.reservations.find((reservation) => reservation.reservationId === reservationId) || null;
    }

    async getReservationByFilter(filter: ReservationFilterOptions): Promise<Reservation[] | null> {
        const result= this.reservations.filter((reservation) =>
            (!filter.date || reservation.date === filter.date) &&
            (!filter.hour || reservation.hour === filter.hour) &&
            (!filter.idLab || reservation.idLab === filter.idLab) &&
            (!filter.idUser || reservation.idUser === filter.idUser) &&
            (!filter.status || reservation.status === filter.status)
        );

        return result.length > 0 ? result : null;
    }
    
    async deleteReservationById(reservationId: string): Promise<Reservation | null> {
        const index= this.reservations.findIndex((reservation) => reservation.reservationId === reservationId)

        if (index === -1){
            return null
        }
        
        return this.reservations.splice(index, 1)[0]
    }

    async updateReservationStatus(reservationId: string, reservationUpdateOptions: ReservationUpdateOptions ): Promise<Reservation | null> {
        const reservation= this.reservations.find((reservation) => reservation.reservationId === reservationId)|| null;

        if (reservation === null) {
            return null;
        }
        
        Object.assign(reservation, reservationUpdateOptions);

        return reservation;
    }
}