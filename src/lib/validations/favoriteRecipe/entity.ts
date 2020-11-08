import { object, string } from 'superstruct';

export const validFavoriteRecipeEntity = object({
  user: string(),
  recipe: string()
});