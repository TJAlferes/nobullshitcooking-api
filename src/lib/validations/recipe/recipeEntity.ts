import { struct } from 'superstruct';

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
    recipeImage: 'nobsc-recipe-default',
    equipmentImage: 'nobsc-recipe-equipment-default',
    ingredientsImage: 'nobsc-recipe-ingredients-default',
    cookingImage: 'nobsc-recipe-cooking-default'
  }
);

module.exports = validRecipeEntity;