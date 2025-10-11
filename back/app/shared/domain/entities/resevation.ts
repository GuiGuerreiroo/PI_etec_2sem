import { STATUS } from "../enums/status";

export class Reservation {
    constructor (
        public title: string,
        public date: string, //pensar se devo usar timestamp e como restringiria para somente os horarios que se tem no portal
        public idLab: string,
        public idUser: string,
        public status: STATUS,
        public idKit: string,
    ) {}

    toJson(): {
        title: string;
        date: string;
        idLab: string;
        idUser: string;
        status: STATUS;
        idKit: string;
    } {
        return {
            title: this.title,
            date: this.date,
            idLab: this.idLab,
            idUser: this.idUser,
            status: this.status,
            idKit: this.idKit
        };
    }

    static fromJson(json: {
        title: string;
        date: string;
        idLab: string;
        idUser: string;
        status: STATUS;
        idKit: string;
    }): Reservation {
        return new Reservation(
            json.title,
            json.date,
            json.idLab,
            json.idUser,
            json.status,
            json.idKit
        );
    }
}