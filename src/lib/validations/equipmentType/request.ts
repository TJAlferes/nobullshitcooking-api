import { number, object, optional, string } from 'superstruct';

export const validEquipmentTypeRequest = object({
  id: number(),
  name: optional(string())
});