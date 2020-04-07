import { struct } from 'superstruct';

export const validEquipmentRequest = struct({
  equipmentId: 'number',
  equipmentTypeId: 'number?',
  equipmentName: 'string?'
});