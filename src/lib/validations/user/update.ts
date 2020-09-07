import { defaulted, object, string } from 'superstruct';

export const validUserUpdate = object({
  email: string(),
  pass: string(),
  username: string(),
  avatar: defaulted(string(), 'nobsc-user-default')
});