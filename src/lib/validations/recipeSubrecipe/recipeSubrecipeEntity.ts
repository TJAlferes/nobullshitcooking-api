import { struct } from 'superstruct';

const validRecipeSubrecipeEntity = struct({
  recipeId: 'number',
  subrecipeId: 'number',
  amount: 'number',
  measurementId: 'number'
});

module.exports = validRecipeSubrecipeEntity;