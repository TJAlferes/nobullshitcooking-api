const { struct } = require('superstruct');
const validEquipmentEntity = require('./equipmentEntity');
const validIngredientEntity = require('./ingredientEntity');
const validRecipeEntity = require('./recipeEntity');

const validUserEntity = struct(
  {
    email: 'string',
    pass: 'string',
    username: 'string',
    code: 'string',
    avatar: 'string?',
    plan: 'object',
    equipment: [validEquipmentEntity],
    ingredients: [validIngredientEntity],
    recipes: [validRecipeEntity],
  },
  {
    avatar: 'nobsc-user-default-avatar',
    plan: {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
      13: [],
      14: [],
      15: [],
      16: [],
      17: [],
      18: [],
      19: [],
      20: [],
      21: [],
      22: [],
      23: [],
      24: [],
      25: [],
      26: [],
      27: [],
      28: []
    }
  }
);

module.exports = validUserEntity;