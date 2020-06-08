import { defaulted, number, object, string } from 'superstruct';

export const validEquipmentEntity = object(
  {
    equipmentTypeId: number(),
    authorId: number(),
    ownerId: number(),
    equipmentName: string(),
    equipmentDescription: string(),
    equipmentImage: defaulted(string(), 'nobsc-equipment-default')
  }
);