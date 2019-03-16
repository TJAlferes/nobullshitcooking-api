'use strict';

/*
Rolling our own little validations and errors for now,
but may use an npm package like superstruct in the future
*/

const utils = require('../utils/validation');

const REQUIRED_PROPERTIES = [];
const ALLOWED_PROPERTIES = [
  'email',
  'password',
  'facebookAuth',
  'googleAuth',
  'username',
  'avatar',
  'plan',
  'savedRecipes',
  'createdRecipes'
];
const VALID_PROPERTIES = REQUIRED_PROPERTIES.concat(ALLOWED_PROPERTIES);

module.exports.validate = function(user) {
  return Promise.resolve(user)
  .then(utils.validateMissedProperties(REQUIRED_PROPERTIES))
  .then(utils.checkInvalidProperties(VALID_PROPERTIES))
  .then(user => {
    for (let prop of ALLOWED_PROPERTIES) {
      user[prop] = user[prop] || '';
    }
    return user;
  });
};