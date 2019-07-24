const { struct } = require('superstruct');

const validRecipeEquipmentEntity = struct({
  recipeId: 'number',
  equipmentId: 'number',
  amount: 'number'
});

module.exports = validRecipeEquipmentEntity;