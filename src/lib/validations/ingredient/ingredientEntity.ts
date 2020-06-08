import { defaulted, number, object, string } from 'superstruct';

export const validIngredientEntity = object({
  ingredientTypeId: number(),
  authorId: number(),
  ownerId: number(),
  ingredientName: string(),
  ingredientDescription: string(),
  ingredientImage: defaulted(string(), 'nobsc-ingredient-default')
});