import { object, string } from 'superstruct';

export const validVerifyRequest = object({
  email: string(),
  pass: string(),
  confirmationCode: string()
});