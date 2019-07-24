const { struct } = require('superstruct');

const validRecipeTitlesRequest = struct({recipeIds: ['number?']});

module.exports = validRecipeTitlesRequest;