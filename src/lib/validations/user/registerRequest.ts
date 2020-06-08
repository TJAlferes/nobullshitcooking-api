import { object, string } from 'superstruct';

export const validRegisterRequest = object({
  email: string(),
  pass: string(),
  username: string()
});