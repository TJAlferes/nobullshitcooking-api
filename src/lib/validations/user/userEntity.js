const { struct } = require('superstruct');
const { validEquipmentEntity } = require('./equipment');
const { validIngredientEntity } = require('./ingredient');
const { validRecipeEntity } = require('./recipe');

const validUserEntity = struct(
  {
    email: 'string',
    pass: 'string',
    username: 'string',
    avatar: 'string?',
    plan: 'object',
    equipment: `${[validEquipmentEntity]}?`,
    ingredients: `${[validIngredientEntity]}?`,
    recipes: `${[validRecipeEntity]}?`,
  },
  {
    avatar: 'nobsc-user-default-avatar'
  }
);

module.exports = validUserEntity;