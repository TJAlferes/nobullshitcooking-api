const { struct } = require('superstruct');

const validIngredientRequest = struct({
  ingredientId: 'number',
  ingredientTypeId: 'number',
  ingredientName: 'string'
});

module.exports = validIngredientRequest;