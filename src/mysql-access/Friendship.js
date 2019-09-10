class Friendship {
  constructor(pool) {
    this.pool = pool;
    this.getFriendshipByFriendId = this.getFriendshipByFriendId.bind(this);
    this.checkIfBlockedBy = this.checkIfBlockedBy.bind(this);
    this.viewAllMyFriendships = this.viewAllMyFriendships.bind(this);
    this.viewAllMyAcceptedFriendships = this.viewAllMyAcceptedFriendships.bind(this);
    //this.viewAllMyPendingFriendships = this.viewAllMyPendingFriendships.bind(this);
    this.viewAllMyBlockedUsers = this.viewAllMyBlockedUsers.bind(this);
    this.createFriendship = this.createFriendship.bind(this);
    this.acceptFriendship = this.acceptFriendship.bind(this);
    this.rejectFriendship = this.rejectFriendship.bind(this);
    this.deleteFriendship = this.deleteFriendship.bind(this);
    this.blockUser = this.blockUser.bind(this);
    this.unblockUser = this.unblockUser.bind(this);
  }

  /*
    each relationship is represented
    by two records in the table,
    one for each side (each user),
    (except for block/unblock, which must be one-sided)

    as you will see below,
    double (reversed params) execution is needed in
    any INSERT, UPDATE, and DELETE queries
    in order to affect both sides of the relationship,
    (except for block/unblock, which must be one-sided)
  */

  async getFriendshipByFriendId(userId, friendId) {
    const sql = `
      SELECT user_id, friend_id, status
      FROM nobsc_friendships
      WHERE user_id = ? AND friend_id = ?
    `;
    const [ friendship ] = await this.pool.execute(sql, [userId, friendId]);
    return friendship;
  }

  async checkIfBlockedBy(userId, friendId) {
    const sql = `
      SELECT user_id, friend_id
      FROM nobsc_friendships
      WHERE user_id = ? AND friend_id = ? AND status = "blocked"
    `;
    const [ blockedBy ] = await this.pool.execute(sql, [friendId, userId]);
    return blockedBy;
  }

  async viewAllMyFriendships(userId) {
    const sql = `
      SELECT
        u.user_id AS user_id,
        u.username AS username,
        u.avatar AS avatar,
        f.status AS status
      FROM nobsc_users u
      INNER JOIN nobsc_friendships f ON u.user_id = f.friend_id
      WHERE f.user_id = ?
    `;
    const [ friendships ] = await this.pool.execute(sql, [userId]);
    return friendships;
  }

  async viewAllMyAcceptedFriendships(userId) {
    const sql = `
      SELECT
        u.user_id AS user_id,
        u.username AS username,
        u.avatar AS avatar,
        f.status AS status
      FROM nobsc_users u
      INNER JOIN nobsc_friendships f ON u.user_id = f.friend_id
      WHERE f.user_id = ? AND status = "accepted"
    `;
    const [ acceptedFriendships ] = await this.pool.execute(sql, [userId]);
    return acceptedFriendships;
  }

  async viewAllMyPendingFriendships(userId) {
    const sql = `
      SELECT
        u.user_id AS user_id,
        u.username AS username,
        u.avatar AS avatar,
        f.status AS status
      FROM nobsc_users u
      INNER JOIN nobsc_friendships f ON u.user_id = f.friend_id
      WHERE f.user_id = ? AND status = "pending-received"
    `;
    const [ pendingFriendships ] = await this.pool.execute(sql, [userId]);
    return pendingFriendships;
  }

  async viewAllMyBlockedUsers(userId) {
    const sql = `
      SELECT
        u.user_id AS user_id,
        u.username AS username,
        u.avatar AS avatar,
        f.status AS status
      FROM nobsc_users u
      INNER JOIN nobsc_friendships f ON u.user_id = f.friend_id
      WHERE f.user_id = ? AND status = "blocked"
    `;
    const [ blockedUsers ] = await this.pool.execute(sql, [userId]);
    return blockedUsers;
  }

  async createFriendship(friendshipToCreate) {
    const { userId, friendId, status1, status2 } = friendshipToCreate;
    const sql = `
      INSERT INTO nobsc_friendships (user_id, friend_id, status)
      VALUES (?, ?, ?)
    `;
    const [ pendingFriendship ] = await this.pool.execute(sql, [userId, friendId, status1]);
    await this.pool.execute(sql, [friendId, userId, status2]);
    return pendingFriendship;
  }

  async acceptFriendship(userId, friendId) {
    const sql1 = `
      UPDATE nobsc_friendships
      SET status = "accepted"
      WHERE user_id = ? AND friend_id = ? AND status = "pending-received"
      LIMIT 1
    `;
    const sql2 = `
      UPDATE nobsc_friendships
      SET status = "accepted"
      WHERE user_id = ? AND friend_id = ? AND status = "pending-sent"
      LIMIT 1
    `;
    const [ acceptedFriendship ] = await this.pool.execute(sql1, [userId, friendId]);
    await this.pool.execute(sql2, [friendId, userId,]);
    return acceptedFriendship;
  }

  async rejectFriendship(userId, friendId) {
    const sql = `
      DELETE
      FROM nobsc_friendships
      WHERE user_id = ? AND friend_id = ? AND status != "blocked"
      LIMIT 1
    `;
    const [ rejectedFriendship ] = await this.pool.execute(sql, [userId, friendId]);
    await this.pool.execute(sql, [friendId, userId]);
    return rejectedFriendship;
  }

  async deleteFriendship(userId, friendId) {
    const sql = `
      DELETE
      FROM nobsc_friendships
      WHERE user_id = ? AND friend_id = ? AND status != "blocked"
      LIMIT 1
    `;
    const [ deletedFriendship ] = await this.pool.execute(sql, [userId, friendId]);
    await this.pool.execute(sql, [friendId, userId]);
    return deletedFriendship;
  }

  async blockUser(userId, friendId) {
    const sql1 = `
      DELETE
      FROM nobsc_friendships
      WHERE user_id = ? AND friend_id = ?
      LIMIT 1
    `;
    const sql2 = `
      INSERT INTO nobsc_friendships (user_id, friend_id, status)
      VALUES (?, ?, "blocked")
    `;
    await this.pool.execute(sql1, [userId, friendId]);
    await this.pool.execute(sql1, [friendId, userId]);
    const [ blockedUser ] = await this.pool.execute(sql2, [userId, friendId]);
    return blockedUser;
  }

  async unblockUser(userId, friendId) {
    const sql = `
      DELETE
      FROM nobsc_friendships
      WHERE user_id = ? AND friend_id = ?
      LIMIT 1
    `;
    const [ unblockedUser ] = await this.pool.execute(sql, [userId, friendId]);
    return unblockedUser;
  }
}

module.exports = Friendship;