import { Pool, RowDataPacket } from 'mysql2/promise';

export class User implements IUser {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getUserByEmail = this.getUserByEmail.bind(this);
    this.getUserByName = this.getUserByName.bind(this);
    // why both? ^ V
    this.getUserIdByUsername = this.getUserIdByUsername.bind(this);
    this.viewAllUsers = this.viewAllUsers.bind(this);
    this.viewUserById = this.viewUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.setAvatar = this.setAvatar.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async getUserByEmail(email: string) {
    const sql = `
      SELECT user_id, email, pass, username, avatar, confirmation_code
      FROM nobsc_users
      WHERE email = ?
    `;
    const [ userByEmail ] = await this.pool
    .execute<RowDataPacket[]>(sql, [email]);
    return userByEmail;
  }

  async getUserByName(username: string) {
    const sql = `
      SELECT user_id, email, pass, username
      FROM nobsc_users
      WHERE username = ?
    `;
    const [ userByName ] = await this.pool
    .execute<RowDataPacket[]>(sql, [username]);
    return userByName;
  }

  async getUserIdByUsername(username: string) {
    const sql = `
      SELECT user_id, avatar
      FROM nobsc_users
      WHERE username = ?
    `;
    const [ userId ] = await this.pool
    .execute<RowDataPacket[]>(sql, [username]);
    return userId;
  }

  async viewAllUsers(starting: number, display: number) {
    const sql = `
      SELECT username, avatar
      FROM nobsc_users
      ORDER BY username ASC
      LIMIT ?, ?
    `;
    const [ allUsers ] = await this.pool
    .execute<RowDataPacket[]>(sql, [starting, display]);
    return allUsers;
  }

  async viewUserById(userId: number) {
    const sql = `
      SELECT username, avatar
      FROM nobsc_users
      WHERE user_id = ?
    `;
    const [ user ] = await this.pool.execute<RowDataPacket[]>(sql, [userId]);
    return user;
  }

  async createUser({ email, pass, username }: ICreatingUser) {
    const sql = `
      INSERT INTO nobsc_users (email, pass, username)
      VALUES (?, ?, ?)
    `;
    const [ createdUser ] = await this.pool
    .execute<RowDataPacket[]>(sql, [email, pass, username]);
    return createdUser;
  }

  async setAvatar(avatar: string, userId: number) {
    const sql = `
      UPDATE nobsc_users
      SET avatar = ?
      WHERE user_id = ?
      LIMIT 1
    `;
    const [ updatedUser ] = await this.pool
    .execute<RowDataPacket[]>(sql, [avatar, userId]);
    return updatedUser;
  }

  async updateUser({
    userId,
    email,
    pass,
    username,
    avatar
  }: IUpdatingUser) {
    const sql = `
      UPDATE nobsc_users
      SET email = ?, pass = ?, username = ?, avatar = ?
      WHERE user_id = ?
      LIMIT 1
    `;
    const [ updatedUser ] = await this.pool
    .execute<RowDataPacket[]>(sql, [email, pass, username, avatar, userId]);
    return updatedUser;
  }

  async deleteUser(userId: number) {
    const sql = `
      DELETE
      FROM nobsc_users
      WHERE user_id = ?
      LIMIT 1
    `;
    const [ deletedUser ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId]);
    return deletedUser;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IUser {
  pool: Pool;
  getUserByEmail(email: string): Data;
  getUserByName(username: string): Data;
  getUserIdByUsername(username: string): Data;
  viewAllUsers(starting: number, display: number): Data;
  viewUserById(userId: number): Data;
  createUser({ email, pass, username }: ICreatingUser): Data;
  setAvatar(avatar: string, userId: number): Data;
  updateUser({
    userId,
    email,
    pass,
    username,
    avatar
  }: IUpdatingUser): Data;
  deleteUser(userId: number): Data;
}

interface ICreatingUser {
  email: string;
  pass: string;
  username: string;
}

interface IUpdatingUser {
  userId: number;
  email: string;
  pass: string;
  username: string;
  avatar: string;
}