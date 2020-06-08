import { defaulted, number, object, string } from 'superstruct';

export const validRecipeEntity = object({
  recipeTypeId: number(),
  cuisineId: number(),
  authorId: number(),
  ownerId: number(),
  title: string(),
  description: string(),
  directions: string(),
  recipeImage: defaulted(string(), 'nobsc-recipe-default'),
  equipmentImage: defaulted(string(), 'nobsc-recipe-equipment-default'),
  ingredientsImage: defaulted(string(), 'nobsc-recipe-ingredients-default'),
  cookingImage: defaulted(string(), 'nobsc-recipe-cooking-default')
});