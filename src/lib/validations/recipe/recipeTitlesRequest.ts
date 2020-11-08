import { array, optional, string } from 'superstruct';

export const validRecipeTitlesRequest = array(optional(string()));