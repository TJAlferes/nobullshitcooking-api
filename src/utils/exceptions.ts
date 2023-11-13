'use strict';

export class ExceptionError extends Error {
  code:    number;
  name:    string;
  message: string;

  constructor(
    code:    number,
    name:    string,
    message: string
  ) {
    super();
    this.code = code;
    this.name = name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }

  toString() {
    return JSON.stringify(this);
  }
}

export function ValidationException(message: string = "Invalid") {
  return new ExceptionError(400, 'ValidationException', message);
}

export function UnauthorizedException(message: string = "Unauthorized") {
  return new ExceptionError(401, 'UnauthorizedException', message)
}

export function ForbiddenException(message: string = "Forbidden") {
  return new ExceptionError(403, 'ForbiddenException', message);
}

//export function NotFoundException(message: string = "Not Found") {
//  return new ExceptionError(404, 'NotFoundException', message);
//}
export class NotFoundException extends Error {
  code: number;
  name: string;

  constructor(message: string = 'Not Found') {
    super(message);
    this.code = 404;
    this.name = 'NotFoundException';
  }
}

export function ConflictException(message: string = "Conflict") {
  return new ExceptionError(409, 'ConflictException', message);
}
