import { struct } from 'superstruct';

export const validRecipeIngredientEntity = struct({
  recipeId: 'number',
  ingredientId: 'number',
  amount: 'number',
  measurementId: 'number'
});