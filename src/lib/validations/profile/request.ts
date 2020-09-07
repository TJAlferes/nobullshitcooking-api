import { object, string } from 'superstruct';

export const validProfileRequest = object({username: string()});