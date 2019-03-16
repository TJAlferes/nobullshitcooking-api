'use strict';

/*
Rolling our own little validations and errors for now,
but may use an npm package like superstruct in the future
*/

const utils = require('../utils/validation');

const REQUIRED_PROPERTIES = [
  'email',
  'password',
  'staffname',
  'avatar',
  'plan',
  'savedRecipes',
  'createdRecipes'
];
const ALLOWED_PROPERTIES = [];
const VALID_PROPERTIES = REQUIRED_PROPERTIES.concat(ALLOWED_PROPERTIES);

module.exports.validate = function(staff) {
  return Promise.resolve(staff)
  .then(utils.validateMissedProperties(REQUIRED_PROPERTIES))
  .then(utils.checkInvalidProperties(VALID_PROPERTIES))
  .then(staff => {
    for (let prop of ALLOWED_PROPERTIES) {
      staff[prop] = staff[prop] || '';
    }
    return staff;
  });
};