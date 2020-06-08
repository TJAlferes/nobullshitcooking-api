import { array, number, object, optional } from 'superstruct';

export const validRecipeTitlesRequest = object({
  recipeIds: array(optional(number()))
});