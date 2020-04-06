import { struct } from 'superstruct';

const validIngredientTypeRequest = struct({
  ingredientTypeId: 'number',
  ingredientTypeName: 'string?'
});

module.exports = validIngredientTypeRequest;