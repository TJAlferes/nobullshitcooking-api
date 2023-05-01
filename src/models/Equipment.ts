import { defaulted, number, object, string } from 'superstruct';

export const validEquipment = object({
  equipmentTypeId: number(),
  authorId:        number(),
  ownerId:         number(),
  name:            string(),
  description:     string(),
  image:           defaulted(string(), '')
});
