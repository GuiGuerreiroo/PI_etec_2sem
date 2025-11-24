export enum ROLE {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  PROFESSOR = "PROFESSOR",
}

export function toEnum(value: string): ROLE {
  switch (value) {
    case "ADMIN":
      return ROLE.ADMIN;
      
    case "MODERATOR":
      return ROLE.MODERATOR;

    case "PROFESSOR":
      return ROLE.PROFESSOR;

    default:
      throw new Error("Invalid value");
  }
}

export function isRole(possibleRole: string): boolean{
  // caso a possible role seja uma das roles disponiveis, ele retornara true
  return Object.values(ROLE).includes(possibleRole as ROLE)
}