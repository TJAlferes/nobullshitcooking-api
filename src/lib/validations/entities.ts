import { number, object, string } from 'superstruct';

export const validRecipeEquipment =
  object({recipeId: number(), equipmentId: number(), amount: number()});

export const validRecipeIngredient = object({
  recipeId: number(),
  ingredientId: number(),
  amount: number(),
  measurementId: number()
});

export const validRecipeMethod =
  object({recipeId: number(), methodId: number()});

export const validRecipeSubrecipe = object({
  recipeId: number(),
  subrecipeId: number(),
  amount: number(),
  measurementId: number()
});

