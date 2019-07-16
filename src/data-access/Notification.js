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
      SELECT sender_id, note
      FROM nobsc_notifications
      WHERE notification_id = ? and receiver_id = ?
    `;
    const [ notification ] = await this.pool.execute(sql, [notificationId, userId]);
    return notification;
  }

  async viewAllNotificationsForUser(userId) {
    const sql = `
      SELECT sender_id, note
      FROM nobsc_notifications
      WHERE read = 0 AND receiver_id = ?
    `;
    const [ notifications ] = await this.pool.execute(sql, [userId])
  }

  async createNotification(notificationInfo) {

  }

  async markNotificationAsRead(notificationId, userId) {
    const sql = `
      UPDATE nobsc_notifications
      SET read = 1
      WHERE notification_id = ? and receiver_id = ?
    `;
  }

  // make a weekly(?) job
  /*async deleteOldNotifications() {
    // something like
    const sql = `
      DELETE
      FROM nobsc_notifications
      WHERE DATEDIFF(CURDATE(), nobsc_notifications.created_on) > 30
    `;
    // etc.
  }
  */
}

module.exports = Notification;