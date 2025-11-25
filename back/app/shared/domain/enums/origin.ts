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

export function isOrigin(possibleOrigin: string): boolean{
    // caso a possible origin seja uma das origins disponiveis, ele retornara true
    return Object.values(ORIGIN).includes(possibleOrigin as ORIGIN)
}