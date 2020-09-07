import { number, object } from 'superstruct';

export const validRecipeEquipmentEntity = object({
  recipeId: number(),
  equipmentId: number(),
  amount: number()
});