import { Pool } from 'mysql2/promise';

interface IUser {
  email: string
  pass: string
  username: string
}

export class User {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getUserByEmail = this.getUserByEmail.bind(this);
    this.getUserByName = this.getUserByName.bind(this);
    this.getUserIdByUsername = this.getUserIdByUsername.bind(this);
    this.viewAllUsers = this.viewAllUsers.bind(this);
    this.viewUserById = this.viewUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.setAvatar = this.setAvatar.bind(this);
    //this.updateUser = this.updateUser.bind(this);
    //this.deleteUser = this.deleteUser.bind(this);
  }

  async getUserByEmail(email: string) {
    const sql = `
      SELECT user_id, email, pass, username, avatar, confirmation_code
      FROM nobsc_users
      WHERE email = ?
    `;
    const [ userByEmail ] = await this.pool.execute(sql, [email]);
    return userByEmail;
  }

  async getUserByName(username: string) {
    const sql = `
      SELECT user_id, email, pass, username
      FROM nobsc_users
      WHERE username = ?
    `;
    const [ userByName ] = await this.pool.execute(sql, [username]);
    return userByName;
  }

  async getUserIdByUsername(username: string) {
    const sql = `
      SELECT user_id, avatar
      FROM nobsc_users
      WHERE username = ?
    `;
    const [ userId ] = await this.pool.execute(sql, [username]);
    return userId;
  }

  async viewAllUsers(starting: number, display: number) {
    const sql = `
      SELECT username, avatar
      FROM nobsc_users
      ORDER BY username ASC
      LIMIT ?, ?
    `;
    const [ allUsers ] = await this.pool.execute(sql, [starting, display]);
    return allUsers;
  }

  async viewUserById(userId: number) {
    const sql = `
      SELECT username, avatar
      FROM nobsc_users
      WHERE user_id = ?
    `;
    const [ user ] = await this.pool.execute(sql, [userId]);
    return user;
  }

  async createUser({ email, pass, username }: IUser) {
    const sql = `
      INSERT INTO nobsc_users (email, pass, username)
      VALUES (?, ?, ?)
    `;
    const [ createdUser ] = await this.pool
    .execute(sql, [email, pass, username]);
    return createdUser;
  }

  async setAvatar(avatar: string, userId: number) {
    const sql = `
      UPDATE nobsc_users
      SET avatar = ?
      WHERE user_id = ?
      LIMIT 1
    `;
    const [ updatedUser ] = await this.pool.execute(sql, [avatar, userId]);
    return updatedUser;
  }

  /*async updateUser(userToUpdateWith, userId) {
    const { email, pass, username, avatar } = userToUpdateWith;
    const sql = `
      UPDATE nobsc_users
      SET email = ?, pass = ?, username = ?, avatar = ?
      WHERE user_id = ?
      LIMIT 1
    `;
    const [ updatedUser ] = await this.pool
    .execute(sql, [email, pass, username, avatar, userId]);
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
    return deletedUser;
  }*/
}