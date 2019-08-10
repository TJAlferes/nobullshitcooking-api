class User {
  constructor(pool) {
    this.pool = pool;
    this.getUserByEmail = this.getUserByEmail.bind(this);
    this.getUserByName = this.getUserByName.bind(this);
    this.getUserIdByUsername = this.getUserIdByUsername.bind(this);
    this.viewAllUsers = this.viewAllUsers.bind(this);
    this.viewUserById = this.viewUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    //this.updateUser = this.updateUser.bind(this);
    //this.deleteUser = this.deleteUser.bind(this);
  }

  async getUserByEmail(email) {
    const sql = `
      SELECT user_id, email, pass, username
      FROM nobsc_users
      WHERE email = ?
    `;
    const [ userByEmail ] = await this.pool.execute(sql, [email]);
    //if (!userByEmail) throw new Error("getUserByEmail failed");
    return userByEmail;
  }

  async getUserByName(username) {
    const sql = `
      SELECT user_id, email, pass, username
      FROM nobsc_users
      WHERE username = ?
    `;
    const [ userByName ] = await this.pool.execute(sql, [username]);
    //if (!userByName) throw new Error("getUserByName failed");
    return userByName;
  }

  async getUserIdByUsername(username) {
    const sql = `
      SELECT user_id
      FROM nobsc_users
      WHERE username = ?
    `;
    const [ userId ] = await this.pool.execute(sql, [username]);
    return userId;
  }

  async viewAllUsers(starting, display) {
    const sql = `
      SELECT username, avatar
      FROM nobsc_users
      ORDER BY username ASC
      LIMIT ?, ?
    `;
    const [ allUsers ] = await this.pool.execute(sql, [starting, display]);
    if (!allUsers) throw new Error("viewAllUsers failed");
    return allUsers;
  }

  async viewUserById(userId) {
    const sql = `
      SELECT username, avatar
      FROM nobsc_users
      WHERE user_id = ?
    `;
    const [ user ] = await this.pool.execute(sql, [userId]);
    if (!user) throw new Error("viewUserById failed");
    return user;
  }

  async createUser(userToCreate) {
    const { email, pass, username } = userToCreate;
    const sql = `
      INSERT INTO nobsc_users (email, pass, username)
      VALUES (?, ?, ?)
    `;
    const [ createdUser ] = await this.pool.execute(sql, [email, pass, username]);
    if (!createdUser) throw new Error("createUser failed");
    return createdUser;
  }

  /*async updateUser(userToUpdateWith, userId) {
    const { email, pass, username, avatar } = userToUpdateWith;
    const sql = `
      UPDATE nobsc_users
      SET email = ?, pass = ?, username = ?, avatar = ?
      WHERE user_id = ?
      LIMIT 1
    `;
    const [ updatedUser ] = await this.pool.execute(sql, [email, pass, username, avatar, userId]);
    if (!updatedUser) throw new Error("updateUser failed");
    return updatedUser;
  }*/

  /*async deleteUser(userId) {
    const sql = `
      DELETE
      FROM nobsc_users
      WHERE user_id = ?
      LIMIT 1
    `;
    const [ deletedUser ] = await this.pool.execute(sql, [userId]);
    if (!deletedUser) throw new Error("deleteUser failed");
    return deletedUser;
  }*/
}

module.exports = User;