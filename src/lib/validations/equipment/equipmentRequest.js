const { struct } = require('superstruct');

const validEquipmentRequest = struct({
  equipmentId: 'number',
  equipmentTypeId: 'number?',
  equipmentName: 'string?'
});

module.exports = validEquipmentRequest;