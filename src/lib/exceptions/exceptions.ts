'use strict';

class Exception extends Error {
  constructor(code, name, message, payload) {
    super();
    this.code = code;
    this.name = name;
    this.message = message;
    this.payload = payload;
    Error.captureStackTrace(this, Exception);  // !
  }

  toString() {
    return JSON.stringify(this);
  }
}

module.exports.ExceptionError = Exception;

module.exports.Exception = function(message, payload) {
  return new Exception(null, null, message, payload);
};

module.exports.ValidationException = function(message, payload) {
  return new Exception(400, 'ValidationException', message, payload);
};

module.exports.ForbiddenException = function(message, payload) {
  return new Exception(403, 'ForbiddenException', message, payload);
};

module.exports.NotFoundException = function(message, payload) {
  return new Exception(404, 'NotFoundException', message, payload);
};