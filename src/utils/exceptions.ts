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

export function ValidationException(message: string) {
  return new ExceptionError(400, 'ValidationException', message);
}

export function UnauthorizedException(message: string) {
  return new ExceptionError(401, 'UnauthorizedException', message)
}

export function ForbiddenException(message: string) {
  return new ExceptionError(403, 'ForbiddenException', message);
}

export function NotFoundException(message: string) {
  return new ExceptionError(404, 'NotFoundException', message);
}

export function ConflictException(message: string) {
  return new ExceptionError(409, 'ConflictException', message);
}
