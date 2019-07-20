class Notification {
  constructor(pool) {
    this.pool = pool;
    this.viewNotificationForUser = this.viewNotificationForUser.bind(this);
    this.viewAllNotificationsForUser = this.viewAllNotificationsForUser.bind(this);
    this.markNotificationAsRead = this.markNotificationAsRead.bind(this);
    this.createNotification = this.createNotification.bind(this);
    //this.deleteOldNotifications = this.deleteNotifications.bind(this);  // make a weekly(?) job
  }

  async viewNotificationForUser(notificationId, userId) {
    const sql = `
      SELECT sender_id, type, created_on, note
      FROM nobsc_notifications
      WHERE notification_id = ? AND receiver_id = ? AND read = 0
    `;
    const [ notification ] = await this.pool.execute(sql, [notificationId, userId]);
    return notification;
  }

  async viewAllNotificationsForUser(userId) {
    const sql = `
      SELECT sender_id, type, created_on
      FROM nobsc_notifications
      WHERE read = 0 AND receiver_id = ? AND read = 0
    `;
    const [ notifications ] = await this.pool.execute(sql, [userId])
  }

  async createNotification(notificationInfo) {
    const { senderId, receiverId, note, read } = notificationInfo;
    const sql = `
      INSERT INTO nobsc_notifications
      (sender_id, receiver_id, read, type, note, created_on)
      VALUES
      (?, ?, ?, ?)
    `;
    const [ notification ] = await this.pool.execute(sql, [senderId, receiverId, note, read]);
  }

  async markNotificationAsRead(notificationId, userId) {
    const sql = `
      UPDATE nobsc_notifications
      SET read = 1
      WHERE notification_id = ? and receiver_id = ?
    `;
    const [ notification ] = await this.pool.execute(sql, [notificationId, userId]);
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

module.exports = Notification;