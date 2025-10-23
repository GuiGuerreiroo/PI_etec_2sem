import { HOUR } from "../enums/hours";
import { STATUS } from "../enums/status";

export class Reservation {
    constructor (
        public reservationId: string,
        public date: string, //pensar se devo usar timestamp e como restringiria para somente os horarios que se tem no portal
        public hour: HOUR,
        public idLab: string,
        public idUser: string,
        public status: STATUS,
        public idKit: string,
    ) {}

    toJson(): {
        reservationId: string;
        date: string;
        hour: HOUR;
        idLab: string;
        idUser: string;
        status: STATUS;
        idKit: string;
    } {
        return {
            reservationId: this.reservationId,
            date: this.date,
            hour: this.hour,
            idLab: this.idLab,
            idUser: this.idUser,
            status: this.status,
            idKit: this.idKit
        };
    }

    static fromJson(json: {
        reservationId: string;
        date: string;
        hour: HOUR;
        idLab: string;
        idUser: string;
        status: STATUS;
        idKit: string;
    }): Reservation {
        return new Reservation(
            json.reservationId,
            json.date,
            json.hour,
            json.idLab,
            json.idUser,
            json.status,
            json.idKit
        );
    }
}