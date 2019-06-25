const { struct } = require('superstruct');

const validEquipmentTypeRequest = struct({
  equipmentTypeId: 'number',
  equipmentTypeName: 'string?'
});

module.exports = validEquipmentTypeRequest;