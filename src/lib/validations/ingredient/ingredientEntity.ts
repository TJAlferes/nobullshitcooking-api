import { struct } from 'superstruct';

export const validIngredientEntity = struct(
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