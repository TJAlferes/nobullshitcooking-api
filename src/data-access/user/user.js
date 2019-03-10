class User {
  constructor(pool) {
    this.pool = pool;
    this.viewAllUsers = this.viewAllUsers.bind(this);
    this.viewUserById = this.viewUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  viewAllUsers(starting, display) {
    const sql = `
      SELECT username, avatar
      FROM nobsc_users
      ORDER BY username ASC
      LIMIT ${starting}, ${display}
    `;  // important (security): use ?, ? in LIMIT instead?
    return pool.execute(sql);
  }

  viewUserById(userId) {  // profile and plan info too (separate table?) (public or private option)
    const sql = `
      SELECT username, avatar
      FROM nobsc_users
      WHERE user_id = ?
    `;
    return pool.execute(sql, [userId]);
  }

  createUser(userInfo) {
    const { id, name, password, avatar } = userInfo;
    const sql = `
      INSERT INTO nobsc_users
      (user_id, username, password, avatar)
      VALUES
      (?, ?, ?, ?)
    `;
    return pool.execute(sql, [id, name, password, avatar]);
  }

  updateUser(userInfo) {
    const { id, name, password, avatar } = userInfo;
    const sql = `
      UPDATE nobsc_users
      SET username = ?, password = ?, avatar = ?
      WHERE user_id = ?
      LIMIT 1
    `;
    return pool.execute(sql, [name, password, avatar, id]);
  }

  deleteUser(userId) {
    const sql = `
      DELETE
      FROM nobsc_users
      WHERE user_id = ?
      LIMIT 1
    `;
    return pool.execute(sql, [userId]);
  }
}

module.exports = User;