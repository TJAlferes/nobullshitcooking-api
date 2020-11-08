import { string, object } from 'superstruct';

export const validSavedRecipeEntity = object({
  user: string(),
  recipe: string()
});