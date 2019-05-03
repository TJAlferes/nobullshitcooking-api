class User {
  constructor(pool) {
    this.pool = pool;
    this.viewAllUsers = this.viewAllUsers.bind(this);
    this.viewUserById = this.viewUserById.bind(this);
    this.getUserByEmail = this.getUserByEmail.bind(this);  // get-- are for auth only, use view-- for public purposes
    this.getUserByName = this.getUserByName.bind(this);  // get-- are for auth only, use view-- for public purposes
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.viewPlan = this.viewPlan.bind(this);
    this.updatePlan = this.updatePlan.bind(this);
  }

  async viewAllUsers(starting, display) {
    const sql = `
      SELECT username, avatar
      FROM nobsc_users
      ORDER BY username ASC
      LIMIT ?, ?
    `;  // important (security): use ?, ? in LIMIT instead?
    const [ allUsers ] = await this.pool.execute(sql, [starting, display]);
    if (!allUsers) throw new Error("viewAllUsers failed");
    return allUsers;
  }

  async viewUserById(userId) {  // profile and plan info too (separate table?) (public or private option)
    const sql = `
      SELECT username, avatar
      FROM nobsc_users
      WHERE user_id = ?
    `;
    const [ user ] = await this.pool.execute(sql, [userId]);
    if (!user) throw new Error("viewUserById failed");
    return user;
  }

  async getUserByEmail(email) {
    const sql = `
      SELECT user_id, email, pass, username
      FROM nobsc_users
      WHERE email = ?
    `;
    const [ userByEmail ] = await this.pool.execute(sql, [email]);
    if (!userByEmail) throw new Error("getUserByEmail failed");
    return userByEmail;
  }

  async getUserByName(username) {
    const sql = `
      SELECT user_id, email, pass, username
      FROM nobsc_users
      WHERE username = ?
    `;
    const [ userByName ] = await this.pool.execute(sql, [username]);
    if (!userByName) throw new Error("getUserByName failed");
    return userByName;
  }

  async createUser(userInfo) {
    const { email, password, username, avatar, plan } = userInfo;
    console.log(email, password, username, avatar, plan);
    const sql = `
      INSERT INTO nobsc_users
      (email, pass, username, avatar, plan)
      VALUES
      (?, ?, ?, ?, ?)
    `;  // plan must be valid JSON
    const [ createdUser ] = await this.pool.execute(sql, [email, password, username, avatar, plan]);
    console.log(createdUser)
    if (!createdUser) throw new Error("createUser failed");
    return createdUser;
  }

  async updateUser(userInfo) {
    const { userId, email, password, username, avatar } = userInfo;
    const sql = `
      UPDATE nobsc_users
      SET email = ?, pass = ?, username = ?, avatar = ?
      WHERE user_id = ?
      LIMIT 1
    `;
    const [ updatedUser ] = await this.pool.execute(sql, [email, password, username, avatar, userId]);
    if (!updatedUser) throw new Error("updateUser failed");
    return updatedUser;
  }

  async deleteUser(userId) {
    const sql = `
      DELETE
      FROM nobsc_users
      WHERE user_id = ?
      LIMIT 1
    `;
    const [ deletedUser ] = await this.pool.execute(sql, [userId]);
    if (!deletedUser) throw new Error("deleteUser failed");
    return deletedUser;
  }

  async viewPlan(userId) {
    const sql = `
      SELECT plan
      FROM nobsc_users
      WHERE user_id = ?
    `;  // JSON_EXTRACT() JSON_UNQUOTE() ?
    const [ plan ] = await this.pool.execute(sql, [userId]);
    if (!plan) throw new Error("viewPlan failed");
    return plan;
  }

  async updatePlan(userInfo) {
    const { userId, plan } = userInfo;
    const sql = `
      UPDATE nobsc_users
      SET plan = ?
      WHERE user_id = ?
      LIMIT 1
    `;  // must be valid JSON, two options, either update the entire JSON or update only what needs to be updated
    const [ updatedPlan ] = await this.pool.execute(sql, [plan, userId]);
    if (!updatedPlan) throw new Error("updatePlan failed");
    return updatedPlan;
  }
}

module.exports = User;