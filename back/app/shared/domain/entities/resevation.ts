import { HOUR } from "../enums/hours";
import { STATUS } from "../enums/status";

export class Reservation {
    constructor(
        public date: string, //pensar se devo usar timestamp e como restringiria para somente os horarios que se tem no portal
        public hour: HOUR,
        public labId: string,
        public userId: string,
        public status: STATUS,
        public kitId: string,
        public reservationId?: string,
    ) { }

    toJson(): {
        reservationId?: string;
        date: string;
        hour: HOUR;
        labId: string;
        userId: string;
        status: STATUS;
        kitId: string;
    } {
        return {
            date: this.date,
            hour: this.hour,
            labId: this.labId,
            userId: this.userId,
            status: this.status,
            kitId: this.kitId,
            reservationId: this.reservationId,
        };
    }

    static fromJson(json: {
        date: string;
        hour: HOUR;
        labId: string;
        userId: string;
        status: STATUS;
        kitId: string;
        reservationId?: string;
    }): Reservation {
        return new Reservation(
            json.date,
            json.hour,
            json.labId,
            json.userId,
            json.status,
            json.kitId,
            json.reservationId
        );
    }
}