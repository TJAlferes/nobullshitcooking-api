import { defaulted, object, string } from 'superstruct';

export const validRecipeEntity = object({
  type: string(),
  cuisine: string(),
  author: string(),
  owner: string(),
  title: string(),
  description: string(),
  activeTime: string(),
  totalTime: string(),
  directions: string(),
  recipeImage: defaulted(string(), 'nobsc-recipe-default'),
  equipmentImage: defaulted(string(), 'nobsc-recipe-equipment-default'),
  ingredientsImage: defaulted(string(), 'nobsc-recipe-ingredients-default'),
  cookingImage: defaulted(string(), 'nobsc-recipe-cooking-default'),
  video: string()
});