export enum STATUS {
    SCHEDULED= "MARCADO",
    COMPLETED= "CONCLUIDO"
}

export function toEnumStatus(value: string): STATUS {
    switch(value) {
        case "MARCADO":
            return STATUS.SCHEDULED;
            
        case "CONCLUIDO":
            return STATUS.COMPLETED;

        default:
            throw new Error("Invalid value");
    }
}

export function isStatus(value: string): boolean {
    return Object.values(STATUS).includes(value as STATUS);
}