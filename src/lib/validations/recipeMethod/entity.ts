import { string, object } from 'superstruct';

export const validRecipeMethodEntity = object({
  recipe: string(),
  method: string()
});