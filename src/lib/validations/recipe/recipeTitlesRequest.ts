import { struct } from 'superstruct';

export const validRecipeTitlesRequest = struct({recipeIds: ['number?']});