const { struct } = require('superstruct');

const validRecipeEntity = struct(
  {
    recipeTypeId: 'number',
    cuisineId: 'number',
    authorId: 'number',
    ownerId: 'number',
    title: 'string',
    description: 'string',
    directions: 'string',
    recipeImage: 'string',
    equipmentImage: 'string',
    ingredientsImage: 'string',
    cookingImage: 'string'
  },
  {
    recipeImage: 'nobsc-recipe-default.png',
    equipmentImage: 'nobsc-recipe-equipment-default.png',
    ingredientsImage: 'nobsc-recipe-ingredients-default.png',
    cookingImage: 'nobsc-recipe-cooking-default.png'
  }
);

module.exports = validRecipeEntity;