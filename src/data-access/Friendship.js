class Friendship {
  constructor(pool) {
    this.pool = pool;
    this.viewFriendshipsByUser = this.viewFriendshipsByUser.bind(this);
    this.viewPendingFriendshipsByUser = this.viewPendingFriendshipsByUser.bind(this);
    this.viewAcceptedFriendshipsByUser = this.viewAcceptedFriendshipsByUser.bind(this);
    this.viewBlockedUsersByUser = this.viewBlockedUsersByUser.bind(this);
    this.createFriendship = this.createFriendship.bind(this);
    this.acceptFriendship = this.acceptFriendship.bind(this);
    this.deleteFriendship = this.deleteFriendship.bind(this);
  }

  async viewFriendshipsByUser(userId) {
    const sql = `
      SELECT friend_id
      FROM nobsc_friends
      WHERE user_id = ?
    `;
    const [ friendships ] = this.pool.execute(sql, [userId]);
    return friendships;
  }

  async viewPendingFriendshipsByUser(userId) {
    const sql = `
      SELECT friend_id
      FROM nobsc_friends
      WHERE user_id = ? AND status = "pending"
    `;
    const [ pendingFriendships ] = this.pool.execute(sql, [userId]);
    return pendingFriendships;
  }

  async viewAcceptedFriendshipsByUser(userId) {
    const sql = `
      SELECT friend_id
      FROM nobsc_friends
      WHERE user_id = ? AND status = "accepted"
    `;
    const [ acceptedFriendships ] = this.pool.execute(sql, [userId]);
    return acceptedFriendships;
  }

  async viewBlockedUsersByUser(userId) {
    const sql = `
      SELECT friend_id
      FROM nobsc_friends
      WHERE user_id = ? AND status = "blocked"
    `;
    const [ blockedUsers ] = this.pool.execute(sql, [userId]);
    return blockedUsers;
  }

  async createFriendship(userId, friendId) {
    const sql = `
      INSERT INTO nobsc_friendships (user_id, friend_id, status)
      VALUES (?, ?, "pending")
    `;
    const [ pendingFriendship ] = this.pool.execute(sql, [userId, friendId]);
    return pendingFriendship;
  }

  async acceptFriendship(userId, friendId) {
    const sql = `
      UPDATE nobsc_friendships
      SET status = "accepted"
      WHERE user_id = ? AND friend_id = ?
      LIMIT 1
    `;
    const [ acceptedFriendship ] = this.pool.execute(sql, [userId, friendId]);
    return acceptedFriendship;
  }

  // also used to reject friendship request
  async deleteFriendship(userId, friendId) {
    const sql = `
      DELETE
      FROM nobsc_friendships
      WHERE user_id = ? AND friend_id = ?
      LIMIT 1
    `;
    const [ deletedFriendship ] = this.pool.execute(sql, [userId, friendId]);
    return deletedFriendship;
  }
}

module.exports = Friendship;