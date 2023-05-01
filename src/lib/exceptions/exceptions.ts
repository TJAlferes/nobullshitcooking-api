'use strict';

export class ExceptionError extends Error {
  code: number | null;
  payload: object;

  constructor(
    code: number | null,
    name: string,
    message: string,
    payload: object
  ) {
    super();
    this.code = code;
    this.name = name;
    this.message = message;
    this.payload = payload;
    Error.captureStackTrace(this, ExceptionError);  // !
  }

  toString() {
    return JSON.stringify(this);
  }
}

export function Exception(message: string, payload: object) {
  return new ExceptionError(null, "", message, payload);
}

export function ValidationException(message: string, payload: object) {
  return new ExceptionError(400, 'ValidationException', message, payload);
}

export function ForbiddenException(message: string, payload: object) {
  return new ExceptionError(403, 'ForbiddenException', message, payload);
}

export function NotFoundException(message: string, payload: object) {
  return new ExceptionError(404, 'NotFoundException', message, payload);
}
