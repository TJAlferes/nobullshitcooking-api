import { struct } from 'superstruct';

export const validIngredientTypeRequest = struct({
  ingredientTypeId: 'number',
  ingredientTypeName: 'string?'
});