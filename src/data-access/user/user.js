class User {
  constructor(pool) {
    this.pool = pool;
    this.viewAllUsers = this.viewAllUsers.bind(this);
    this.viewUserById = this.viewUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.viewPlan = this.viewPlan.bind(this);
    this.updatePlan = this.updatePlan.bind(this);
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
    const { email, password, username, avatar, plan } = userInfo;
    const sql = `
      INSERT INTO nobsc_users
      (email, password, username, avatar, plan)
      VALUES
      (?, ?, ?, ?, ?)
    `;  // plan must be valid JSON
    return pool.execute(sql, [email, password, username, avatar, plan]);
  }

  updateUser(userInfo) {
    const { userId, email, password, username, avatar } = userInfo;
    const sql = `
      UPDATE nobsc_users
      SET email = ?, password = ?, username = ?, avatar = ?
      WHERE user_id = ?
      LIMIT 1
    `;
    return pool.execute(sql, [email, password, username, avatar, userId]);
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

  viewPlan(userId) {
    const sql = `
      SELECT plan
      FROM nobsc_users
      WHERE user_id = ?
    `;  // JSON_EXTRACT() JSON_UNQUOTE() ?
    return pool.execute(sql, [userId]);
  }

  updatePlan(userInfo) {
    const { userId, plan } = userInfo;
    const sql = `
      UPDATE nobsc_users
      SET plan = ?
      WHERE user_id = ?
      LIMIT 1
    `;  // must be valid JSON, two options, either update the entire JSON or update only what needs to be updated
    return pool.execute(sql, [plan, userId]);
  }
}

module.exports = User;