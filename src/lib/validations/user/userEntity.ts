import { defaulted, object, string } from 'superstruct';

export const validUserEntity = object({
  email: string(),
  pass: string(),
  username: string(),
  avatar: defaulted(string(), 'nobsc-user-default'),
  confirmationCode: defaulted(string(), null)
});