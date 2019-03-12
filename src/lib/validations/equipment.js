'use strict';

/*
Rolling our own little validations and errors for now,
but may use an npm package like superstruct in the future
*/

const utils = require('../utils/validation');

const REQUIRED_PROPERTIES = [
  'equipmentId',
  'equipmentName',
  'equipmentTypeId'
];
const ALLOWED_PROPERTIES = [
  'equipmentImage'
];
const VALID_PROPERTIES = REQUIRED_PROPERTIES.concat(ALLOWED_PROPERTIES);

module.exports.validate = function(equipment) {
  return Promise.resolve(equipment)
  .then(utils.validateMissedProperties(REQUIRED_PROPERTIES))
  .then(utils.checkInvalidProperties(VALID_PROPERTIES))
  .then(equipment => {
    for (let prop of ALLOWED_PROPERTIES) {
      equipment[prop] = equipment[prop] || '';
    }
    return equipment;
  });
};