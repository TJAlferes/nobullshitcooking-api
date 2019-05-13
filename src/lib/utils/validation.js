'use strict';

/*
Rolling our own little validations and errors for now,
but may use an npm package like superstruct in the future

Update May 12th 2019 -- going with express-validator for now,
will keep this code around just in case.
*/

const exceptions = require('../exceptions/exceptions');

let createErrorMessage = (msg, props) => {
  if (props) msg += `: ${props.join(', ')}`;
  return msg;
}

// runs second argument against first, if any of second are not defined on first, 
module.exports.getMissedProperties = function(obj, requiredProperties) {
  return requiredProperties.filter(prop => obj[prop] === undefined);
};

// runs first argument's properties against second argument, removes from first any which don't match second
module.exports.getInvalidProperties = function(obj, allowedProperties) {
  return Object.getOwnPropertyNames(obj).filter(prop => allowedProperties.indexOf(prop) === -1);
};

// returns the validated object or throws an exception
module.exports.validateMissedProperties = function(requiredProperties) {
  return function(obj) {
    let missedProperties = module.exports.getMissedProperties(obj, requiredProperties);
    if (missedProperties.length === 0) return obj;
    throw exceptions.ValidationException(
      createErrorMessage('required property(ies) not provided', missedProperties),
      {properties: missedProperties}
    );
  }
};

// returns the validated object or throws an exception
module.exports.checkInvalidProperties = function(allowedProperties) {
  return function(obj) {
    let invalidProperties = module.exports.getInvalidProperties(obj, allowedProperties);
    if (invalidProperties.length === 0) return obj;
    throw exceptions.ValidationException(
      createErrorMessage('property(ies) not allowed', invalidProperties),
      {properties: invalidProperties}
    );
  }
};