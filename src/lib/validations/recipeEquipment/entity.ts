import { number, object, string } from 'superstruct';

export const validRecipeEquipmentEntity = object({
  recipe: string(),
  equipment: string(),
  amount: number()
});