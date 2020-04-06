import { struct } from 'superstruct';

const validRecipeMethodEntity = struct({
  recipeId: 'number',
  methodId: 'number',
});

module.exports = validRecipeMethodEntity;