export enum HOUR {
    "7:10"= "7:10",
    "8:00"= "8:00",
    "8:50"= "8:50",
    "10:00"= "10:00",
    "10:50"= "10:50",
    "11:40"= "11:40",
    "12:30"= "12:30",
    "13:00"= "13:00",
    "13:50"= "13:50",
    "14:40"= "14:40",
    "15:50"= "15:50",
    "16:40"= "16:40",
    "17:30"= "17:30",
    "18:50"= "18:50",
    "20:58"= "20:58"
}

export function toEnum(value: string): HOUR{
    switch(value){
        case "7:10":
            return HOUR["7:10"]

        case "8:00":
            return HOUR["8:00"]

        case "8:50":
            return HOUR["8:50"]

        case "10:00":
            return HOUR["10:00"]

        case "10:50":
            return HOUR["10:50"]

        case "11:40":
            return HOUR["11:40"]

        case "12:30":
            return HOUR["12:30"]

        case "13:00":
            return HOUR["13:00"]

        case "13:50":
            return HOUR["13:50"]

        case "14:40":
            return HOUR["14:40"]

        case "15:50":
            return HOUR["15:50"]

        case "16:40":
            return HOUR["16:40"]

        case "17:30":
            return HOUR["17:30"]

        default:
            throw new Error("Invalid value");
    }
}

export function isHour(possibleHour: string): boolean{
  // caso a possible role seja uma das roles disponiveis, ele retornara true
  return Object.values(HOUR).includes(possibleHour as HOUR)
}