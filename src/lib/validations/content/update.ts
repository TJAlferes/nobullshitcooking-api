import { defaulted, object, string } from 'superstruct';

export const validContentUpdate = object({
  type: string(),
  owner: string(),
  published: defaulted(string(), null),
  title: string(),
  items: string()
});