import { struct } from 'superstruct';

export const validRecipeEquipmentEntity = struct({
  recipeId: 'number',
  equipmentId: 'number',
  amount: 'number'
});