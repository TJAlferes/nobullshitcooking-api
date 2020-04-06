import { struct } from 'superstruct';

const validEquipmentRequest = struct({
  equipmentId: 'number',
  equipmentTypeId: 'number?',
  equipmentName: 'string?'
});

module.exports = validEquipmentRequest;