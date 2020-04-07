import { struct } from 'superstruct';

export const validEquipmentTypeRequest = struct({
  equipmentTypeId: 'number',
  equipmentTypeName: 'string?'
});