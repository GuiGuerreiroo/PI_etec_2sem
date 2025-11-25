import { ReservationMongoDTO } from "../../../shared/repositories/database/mongo/reservation_repository_mongo";

export async function getAllReservationsResponse(reservations: ReservationMongoDTO[]) {
    return {
        message: "Reservas retornadas com sucesso",
        reservations: reservations.map((reservation) => ({
            id: reservation.id,
            date: reservation.date,
            hour: reservation.hour,
            labName: reservation.labName,
            userName: reservation.userName,
            status: reservation.status,
            kit: reservation.kit
        }))
    }
}