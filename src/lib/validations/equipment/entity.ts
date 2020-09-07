import { defaulted, number, object, string } from 'superstruct';

export const validEquipmentEntity = object({
  equipmentTypeId: number(),
  authorId: number(),
  ownerId: number(),
  name: string(),
  description: string(),
  image: defaulted(string(), 'nobsc-equipment-default')
});