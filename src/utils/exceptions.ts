export class ExceptionError extends Error {
  code: number;
  name: string;

  constructor(code: number, name: string, message: string) {
    super(message);
    this.code = code;
    this.name = name;
  }
}

export class ValidationException extends ExceptionError {
  constructor(message: string = 'Invalid') {
    super(400, 'ValidationException', message);
  }
}

export class UnauthorizedException extends ExceptionError {
  constructor(message: string = 'Unauthorized') {
    super(401, 'UnauthorizedException', message);
  }
}

export class ForbiddenException extends ExceptionError {
  constructor(message: string = 'Forbidden') {
    super(403, 'ForbiddenException', message);
  }
}

export class NotFoundException extends ExceptionError {
  constructor(message: string = 'Not Found') {
    super(404, 'NotFoundException', message);
  }
}

export class ConflictException extends ExceptionError {
  constructor(message: string = 'Conflict') {
    super(409, 'ConflictException', message);
  }
}

export function instanceOfAnyException(err: {}) {
  if (err instanceof ExceptionError) return true;
  if (err instanceof ValidationException) return true;
  if (err instanceof UnauthorizedException) return true;
  if (err instanceof ForbiddenException) return true;
  if (err instanceof NotFoundException) return true;
  if (err instanceof ConflictException) return true;
  return false;
}
