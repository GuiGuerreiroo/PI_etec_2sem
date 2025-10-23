export enum STATUS {
    SCHEDULED= "MARCADO",
    COMPLETED= "CONCLUIDO"
}

export function toEnum(value: string): STATUS {
    switch(value) {
        case "MARCADO":
            return STATUS.SCHEDULED;
            
        case "CONCLUIDO":
            return STATUS.COMPLETED;

        default:
            throw new Error("Invalid value");
    }
}