import { defaulted, object, string } from 'superstruct';

export const validContentCreation = object({
  type: string(),
  author: string(),
  owner: string(),
  created: string(),
  published: defaulted(string(), null),
  title: string(),
  items: string()
});