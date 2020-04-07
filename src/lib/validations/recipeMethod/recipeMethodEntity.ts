import { struct } from 'superstruct';

export const validRecipeMethodEntity = struct({
  recipeId: 'number',
  methodId: 'number',
});