const { struct } = require('superstruct');

const validIngredientEntity = struct({
  ingredientTypeId: 'number',
  ingredientName: 'string',
  ingredientDescription: 'string',
  ingredientImage: 'string'
});

module.exports = validIngredientEntity;