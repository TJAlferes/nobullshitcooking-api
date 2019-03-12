'use strict';

/*
Rolling our own little validations and errors for now,
but may use an npm package like superstruct in the future
*/

const utils = require('../utils/validation');

const REQUIRED_PROPERTIES = [
  'recipeId',
  'recipeName',
  'recipeTypeId',
  'recipeImage',
  'authorId',
  'created',
  'steps'
];
const ALLOWED_PROPERTIES = [
  'equipmentImage',
  'ingredientsImage',
  'cookingImage'
];
const VALID_PROPERTIES = REQUIRED_PROPERTIES.concat(ALLOWED_PROPERTIES);

module.exports.validate = function(recipe) {
  return Promise.resolve(recipe)
  .then(utils.validateMissedProperties(REQUIRED_PROPERTIES))
  .then(utils.checkInvalidProperties(VALID_PROPERTIES))
  .then(recipe => {
    for (let prop of ALLOWED_PROPERTIES) {
      recipe[prop] = recipe[prop] || '';
    }
    return recipe;
  });
};