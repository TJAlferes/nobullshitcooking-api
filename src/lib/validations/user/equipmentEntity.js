const { struct } = require('superstruct');

const validEquipmentEntity = struct({
  equipmentTypeId: 'number',
  equipmentName: 'string',
  equipmentDescription: 'string',
  equipmentImage: 'string'
});

module.exports = validEquipmentEntity;