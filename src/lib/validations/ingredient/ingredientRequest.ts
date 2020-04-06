import { struct } from 'superstruct';

const validIngredientRequest = struct({
  ingredientId: 'number',
  ingredientTypeId: 'number?',
  ingredientName: 'string?'
});

module.exports = validIngredientRequest;