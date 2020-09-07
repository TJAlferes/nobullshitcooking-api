import { defaulted, number, object, string } from 'superstruct';

export const validContentUpdate = object({
  contentTypeId: number(),
  ownerId: number(),
  published: defaulted(string(), null),
  title: string(),
  contentItems: string()
});