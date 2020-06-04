import { Pool, RowDataPacket } from 'mysql2/promise';

export class Notification implements INotification {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewNotificationForUser = this.viewNotificationForUser.bind(this);
    this.viewAllNotificationsForUser =
      this.viewAllNotificationsForUser.bind(this);
    this.markNotificationAsRead = this.markNotificationAsRead.bind(this);
    this.createNotification = this.createNotification.bind(this);
    // move and make a weekly(?) job
    //this.deleteOldNotifications = this.deleteNotifications.bind(this);
  }
  
  async viewNotificationForUser(notificationId: number, userId: number) {
    const sql = `
      SELECT sender_id, type, created_on, note
      FROM nobsc_notifications
      WHERE notification_id = ? AND receiver_id = ? AND read = 0
    `;
    const [ notification ] = await this.pool
    .execute<RowDataPacket[]>(sql, [notificationId, userId]);
    return notification;
  }

  async viewAllNotificationsForUser(userId: number) {
    const sql = `
      SELECT sender_id, type, created_on
      FROM nobsc_notifications
      WHERE read = 0 AND receiver_id = ? AND read = 0
    `;
    const [ notifications ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId]);
    return notifications;
  }

  async createNotification({
    senderId,
    receiverId,
    note,
    read
  }: ICreatingNotification) {
    const sql = `
      INSERT INTO nobsc_notifications
      (sender_id, receiver_id, read, type, note, created_on)
      VALUES
      (?, ?, ?, ?)
    `;
    const [ notification ] = await this.pool
    .execute<RowDataPacket[]>(sql, [senderId, receiverId, note, read]);
    return notification;
  }

  async markNotificationAsRead(notificationId: number, userId: number) {
    const sql = `
      UPDATE nobsc_notifications
      SET read = 1
      WHERE notification_id = ? and receiver_id = ?
    `;
    const [ notification ] = await this.pool
    .execute<RowDataPacket[]>(sql, [notificationId, userId]);
    return notification;
  }

  /*async deleteWeekOldReadNotifications() {
    // something like
    const sql = `
      DELETE
      FROM nobsc_notifications
      WHERE read = 1 AND DATEDIFF(CURDATE(), nobsc_notifications.created_on) > 7
    `;
    // etc.
  }
  */

  /*async deleteMonthOldUnreadNotifications() {
    // something like
    const sql = `
      DELETE
      FROM nobsc_notifications
      WHERE read = 0 AND DATEDIFF(CURDATE(), nobsc_notifications.created_on) > 30
    `;
    // etc.
  }
  */
}

type Data = Promise<RowDataPacket[]>;

export interface INotification {
  pool: Pool;
  viewNotificationForUser(notificationId: number, userId: number): Data;
  viewAllNotificationsForUser(userId: number): Data;
  createNotification({
    senderId,
    receiverId,
    note,
    read
  }: ICreatingNotification): Data;
  markNotificationAsRead(notificationId: number, userId: number): Data;
}

interface ICreatingNotification {
  senderId: number
  receiverId: number
  note: string
  read: boolean
}