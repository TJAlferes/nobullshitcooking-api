import { struct } from 'superstruct';

const validEquipmentTypeRequest = struct({
  equipmentTypeId: 'number',
  equipmentTypeName: 'string?'
});

module.exports = validEquipmentTypeRequest;