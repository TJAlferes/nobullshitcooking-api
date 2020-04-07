import { struct } from 'superstruct';

export const validRecipeSubrecipeEntity = struct({
  recipeId: 'number',
  subrecipeId: 'number',
  amount: 'number',
  measurementId: 'number'
});