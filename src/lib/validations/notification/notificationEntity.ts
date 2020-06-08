import { number, object, optional, string } from 'superstruct';

export const validNotificationEntity = object({
  senderId: number(),
  receiverId: number(),
  read: number(),
  type: string(),
  note: string(),
  createdOn: string()
});