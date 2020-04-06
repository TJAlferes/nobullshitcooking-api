import { struct } from 'superstruct';

const validRecipeEquipmentEntity = struct({
  recipeId: 'number',
  equipmentId: 'number',
  amount: 'number'
});

module.exports = validRecipeEquipmentEntity;