const { struct } = require('superstruct');

const validIngredientEntity = struct(
  {
    ingredientTypeId: 'number',
    authorId: 'number',
    ownerId: 'number',
    ingredientName: 'string',
    ingredientDescription: 'string',
    ingredientImage: 'string'
  },
  {
    ingredientImage: 'nobsc-ingredient-default'
  }
);

module.exports = validIngredientEntity;