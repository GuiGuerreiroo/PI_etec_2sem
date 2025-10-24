export enum ORIGIN {
    GENERAL="GERAL",
    INDIVIDUAL="INDIVIDUAL"
}

export function toEnum(value: string): ORIGIN{
    switch(value){
        case "GERAL":
            return ORIGIN.GENERAL

        case "INDIVIDUAL":
            return ORIGIN.INDIVIDUAL

        default:
            throw new Error("Invalid value");
    }
}