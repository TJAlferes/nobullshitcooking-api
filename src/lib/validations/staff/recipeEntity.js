const { struct } = require('superstruct');

const validRequiredEquipment = struct({
  key: 'number',
  type: 'string',
  amount: 'number',
  equipment: 'string'
});

const validRequiredIngredient = struct({
  key: 'number',
  type: 'string',
  unit: 'string',
  amount: 'number',
  ingredient: 'string'
});

const validRequiredSubrecipe = struct({
  key: 'number',
  cuisine: 'string',
  type: 'string',
  unit: 'string',
  amount: 'number',
  subrecipe: 'string'
});

const validRecipeEntity = struct(
  {
    recipeTypeId: 'number',
    cuisineId: 'number',
    title: 'string',
    description: 'string',
    directions: 'string',
    requiredEquipment: `[${validRequiredEquipment}]?`,
    requiredIngredients: [validRequiredIngredient],
    requiredSubrecipes: `[${validRequiredSubrecipe}]?`,
    recipeImage: 'string',
    equipmentImage: 'string',
    ingredientsImage: 'string',
    cookingImage: 'string'
  },
  {
    recipeImage: 'nobsc-default-recipe-image',
    equipmentImage: 'nobsc-default-equipment-image',
    ingredientsImage: 'nobsc-default-ingredients-image',
    cookingImage: 'nobsc-default-cooking-image'
  }
);

module.exports = validRecipeEntity;