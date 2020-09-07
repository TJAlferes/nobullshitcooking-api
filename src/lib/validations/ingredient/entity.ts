import { array, defaulted, number, object, optional, string } from 'superstruct';

export const validIngredientEntity = object({
  ingredientTypeId: number(),
  authorId: number(),
  ownerId: number(),
  brand: defaulted(string(), ''),
  variety: defaulted(string(), ''),
  name: string(),
  altNames: optional(array(string())),
  description: string(),
  image: defaulted(string(), 'nobsc-ingredient-default')
});