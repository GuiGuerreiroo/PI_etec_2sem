// Base exception class
export class BaseApplicationException extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Database exception (500)
export class DatabaseException extends BaseApplicationException {
  constructor(message = "Ocorreu um erro no banco de dados") {
    super(message, 500);
  }
}

// Unauthorized (401)
export class UnauthorizedException extends BaseApplicationException {
  constructor(message = "Acesso não autorizado") {
    super(message, 401);
  }
}

// Forbidden (403)
export class ForbiddenException extends BaseApplicationException {
  constructor(message = "Acesso proibido") {
    super(message, 403);
  }
}

// Unprocessable entity (422)
export class UnprocessableEntityException extends BaseApplicationException {
  constructor(message = "Entidade não processável") {
    super(message, 422);
  }
}

// Bad request (400) — agora herdando corretamente
export class BadRequestException extends BaseApplicationException {
  constructor(details: any) {
    super("Bad Request", 400, details);
  }
}

// Not found (404)
export class NotFoundException extends BaseApplicationException {
  constructor(message = "Recurso não encontrado") {
    super(message, 404);
  }
}

// Conflict (409)
export class ConflictException extends BaseApplicationException {
  constructor(message = "Conflito detectado") {
    super(message, 409);
  }
}

// Internal server error (500)
export class InternalServerErrorException extends BaseApplicationException {
  constructor(message = "Erro interno do servidor") {
    super(message, 500);
  }
}

// Service unavailable (503)
export class ServiceUnavailableException extends BaseApplicationException {
  constructor(message = "Serviço indisponível") {
    super(message, 503);
  }
}
