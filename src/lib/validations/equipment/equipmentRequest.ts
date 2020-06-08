import { number, object, optional, string } from 'superstruct';

export const validEquipmentRequest = object({
  equipmentId: number(),
  equipmentTypeId: optional(number()),
  equipmentName: optional(string())
});