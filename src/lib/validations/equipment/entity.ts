import { defaulted, object, string } from 'superstruct';

export const validEquipmentEntity = object({
  type: string(),
  author: string(),
  owner: string(),
  name: string(),
  description: string(),
  image: defaulted(string(), 'nobsc-equipment-default')
});