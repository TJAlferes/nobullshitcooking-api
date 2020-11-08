import { number, object, string } from 'superstruct';

export const validRecipeSubrecipeEntity = object({
  recipe: string(),
  subrecipe: string(),
  amount: number(),
  measurement: string()
});