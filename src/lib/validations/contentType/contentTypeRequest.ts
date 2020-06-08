import { number, object, optional, string } from 'superstruct';

export const validContentTypeRequest = object({
  ingredientTypeId: number(),
  contentTypeName: optional(string())
});