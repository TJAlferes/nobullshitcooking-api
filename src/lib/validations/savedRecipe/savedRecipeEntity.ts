import { struct } from 'superstruct';

const validSavedRecipeEntity = struct({
  userId: 'number',
  recipeId: 'number'
});

module.exports = validSavedRecipeEntity;