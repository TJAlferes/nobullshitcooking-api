import { object, string } from 'superstruct';

export const validNotificationEntity = object({
  sender: string(),
  receiver: string(),
  read: string(),
  type: string(),
  note: string(),
  created: string()
});