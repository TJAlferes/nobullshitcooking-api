import { object, string } from 'superstruct';

export const validLoginRequest = object({email: string(), pass: string()});