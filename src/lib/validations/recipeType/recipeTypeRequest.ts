import { struct } from 'superstruct';

const validRecipeTypeRequest = struct({
  recipeTypeId: 'number',
  recipeTypeName: 'string?'
});

module.exports = validRecipeTypeRequest;