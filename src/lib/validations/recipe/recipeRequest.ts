import { object, optional, string } from 'superstruct';

export const validRecipeRequest = object({
  id: string(),
  type: optional(string()),
  cuisine: optional(string()),
  title: optional(string())
});