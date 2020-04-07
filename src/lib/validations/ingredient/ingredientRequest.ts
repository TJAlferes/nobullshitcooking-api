import { struct } from 'superstruct';

export const validIngredientRequest = struct({
  ingredientId: 'number',
  ingredientTypeId: 'number?',
  ingredientName: 'string?'
});