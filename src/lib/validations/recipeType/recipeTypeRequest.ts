import { struct } from 'superstruct';

export const validRecipeTypeRequest = struct({
  recipeTypeId: 'number',
  recipeTypeName: 'string?'
});