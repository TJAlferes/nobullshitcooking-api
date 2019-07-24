class Friendship {
  constructor(pool) {
    this.pool = pool;
    this.viewAllMyFriendships = this.viewAllMyFriendships.bind(this);
    this.viewAllMyAcceptedFriendships = this.viewAllMyAcceptedFriendships.bind(this);
    this.viewAllMyPendingFriendships = this.viewAllMyPendingFriendships.bind(this);
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
    one for each side (each user)

    as you will see below,
    double (reversed params) execution is needed in
    any INSERT, UPDATE, and DELETE queries
    in order to affect both sides of the relationship
  */

  async viewAllMyFriendships(userId) {
    const sql = `
      SELECT friend_id
      FROM nobsc_friends
      WHERE user_id = ?
    `;
    const [ friendships ] = await this.pool.execute(sql, [userId]);
    return friendships;
  }

  async viewAllMyAcceptedFriendships(userId) {
    const sql = `
      SELECT friend_id
      FROM nobsc_friends
      WHERE user_id = ? AND status = "accepted"
    `;
    const [ acceptedFriendships ] = await this.pool.execute(sql, [userId]);
    return acceptedFriendships;
  }

  async viewAllMyPendingFriendships(userId) {
    const sql = `
      SELECT friend_id
      FROM nobsc_friends
      WHERE user_id = ? AND status = "pending"
    `;
    const [ pendingFriendships ] = await this.pool.execute(sql, [userId]);
    return pendingFriendships;
  }

  async viewAllMyBlockedUsers(userId) {
    const sql = `
      SELECT friend_id
      FROM nobsc_friends
      WHERE user_id = ? AND status = "blocked"
    `;
    const [ blockedUsers ] = await this.pool.execute(sql, [userId]);
    return blockedUsers;
  }

  async createFriendship(userId, friendId) {
    const sql = `
      INSERT INTO nobsc_friendships (user_id, friend_id, status)
      VALUES (?, ?, "pending")
    `;
    const [ pendingFriendship ] = await this.pool.execute(sql, [userId, friendId]);
    await this.pool.execute(sql, [friendId, userId]);
    return pendingFriendship;
  }

  async acceptFriendship(userId, friendId) {
    const sql = `
      UPDATE nobsc_friendships
      SET status = "accepted"
      WHERE user_id = ? AND friend_id = ?
      LIMIT 1
    `;
    const [ acceptedFriendship ] = await this.pool.execute(sql, [userId, friendId]);
    await this.pool.execute(sql, [friendId, userId]);
    return acceptedFriendship;
  }

  async rejectFriendship(userId, friendId) {
    const sql = `
      DELETE
      FROM nobsc_friendships
      WHERE user_id = ? AND friend_id = ?
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
      WHERE user_id = ? AND friend_id = ?
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
    await this.pool.execute(sq2, [friendId, userId]);
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
    await this.pool.execute(sql, [friendId, userId]);
    return unblockedUser;
  }
}

module.exports = Friendship;