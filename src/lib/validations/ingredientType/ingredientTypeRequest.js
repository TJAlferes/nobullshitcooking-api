const { struct } = require('superstruct');

const validIngredientTypeRequest = struct({
  ingredientTypeId: 'number',
  ingredientTypeName: 'string?'
});

module.exports = validIngredientTypeRequest;