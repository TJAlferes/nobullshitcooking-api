import { struct } from 'superstruct';

const validRecipeTitlesRequest = struct({recipeIds: ['number?']});

module.exports = validRecipeTitlesRequest;