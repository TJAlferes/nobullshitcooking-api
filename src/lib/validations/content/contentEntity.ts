import { defaulted, number, object, string } from 'superstruct';

export const validContentEntity = object({
  contentTypeId: number(),
  authorId: number(),
  ownerId: number(),
  created: string(),
  published: defaulted(string(), null),
  contentItems: string(),
});