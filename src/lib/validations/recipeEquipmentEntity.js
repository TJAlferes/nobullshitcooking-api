const { struct } = require('superstruct');

const validRecipeEquipmentEntity = struct({
  equipmentId: 'number',
  amount: 'number'
});

module.exports = validRecipeEquipmentEntity;