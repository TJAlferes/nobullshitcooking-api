import { struct } from 'superstruct';

export const validRecipeRequest = struct({
  recipeId: 'number',
  recipeTypeId: 'number?',
  cuisineId: 'number?',
  title: 'string?'
});