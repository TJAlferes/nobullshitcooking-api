import { number, object, optional, string } from 'superstruct';

export const validEquipmentTypeRequest = object({
  equipmentTypeId: number(),
  equipmentTypeName: optional(string())
});