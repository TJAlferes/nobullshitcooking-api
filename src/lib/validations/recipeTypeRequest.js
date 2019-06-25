const { struct } = require('superstruct');

const validRecipeTypeRequest = struct({
  recipeTypeId: 'number',
  recipeTypeName: 'string?'
});

module.exports = validRecipeTypeRequest;