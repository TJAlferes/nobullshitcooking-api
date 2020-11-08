import { array, defaulted, object, optional, string } from 'superstruct';

export const validIngredientEntity = object({
  type: string(),
  author: string(),
  owner: string(),
  brand: defaulted(string(), ''),
  variety: defaulted(string(), ''),
  name: string(),
  altNames: optional(array(string())),
  description: string(),
  image: defaulted(string(), 'nobsc-ingredient-default')
});