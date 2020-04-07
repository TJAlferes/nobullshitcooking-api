import { struct } from 'superstruct';

export const validEquipmentEntity = struct(
  {
    equipmentTypeId: 'number',
    authorId: 'number',
    ownerId: 'number',
    equipmentName: 'string',
    equipmentDescription: 'string',
    equipmentImage: 'string'
  },
  {
    equipmentImage: 'nobsc-equipment-default'
  }
);