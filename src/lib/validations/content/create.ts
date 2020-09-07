import { defaulted, number, object, string } from 'superstruct';

export const validContentCreation = object({
  contentTypeId: number(),
  authorId: number(),
  ownerId: number(),
  created: string(),
  published: defaulted(string(), null),
  title: string(),
  contentItems: string()
});