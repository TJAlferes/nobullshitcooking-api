import { struct } from 'superstruct';

export const validContentTypeRequest = struct({
  ingredientTypeId: 'number',
  contentTypeName: 'string?'
});