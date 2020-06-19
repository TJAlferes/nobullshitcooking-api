import { Pool, RowDataPacket } from 'mysql2/promise';

export class User implements IUser {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getUserByEmail = this.getUserByEmail.bind(this);  // sensitive
    this.getUserByName = this.getUserByName.bind(this);  // sensitive
    //this.viewUsers = this.viewUsers.bind(this);
    this.viewUserById = this.viewUserById.bind(this);
    this.viewUserByName = this.viewUserByName.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  // sensitive
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

  // sensitive
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

  /*async viewUsers(starting: number, display: number) {
    const sql = `
      SELECT username, avatar
      FROM nobsc_users
      ORDER BY username ASC
      LIMIT ?, ?
    `;
    const [ allUsers ] = await this.pool
    .execute<RowDataPacket[]>(sql, [starting, display]);
    return allUsers;
  }*/

  async viewUserById(userId: number) {
    const sql = `
      SELECT username, avatar
      FROM nobsc_users
      WHERE user_id = ?
    `;
    const [ user ] = await this.pool.execute<RowDataPacket[]>(sql, [userId]);
    return user;
  }

  async viewUserByName(username: string) {
    const sql = `
      SELECT user_id, avatar
      FROM nobsc_users
      WHERE username = ?
    `;
    const [ user ] = await this.pool.execute<RowDataPacket[]>(sql, [username]);
    return user;
  }

  async createUser({ email, pass, username, confirmationCode }: ICreatingUser) {
    const sql = `
      INSERT INTO nobsc_users (email, pass, username, confirmation_code)
      VALUES (?, ?, ?, ?)
    `;
    const [ createdUser ] = await this.pool
    .execute<RowDataPacket[]>(sql, [email, pass, username, confirmationCode]);
    return createdUser;
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
  //viewUsers(starting: number, display: number): Data;
  viewUserById(userId: number): Data;
  viewUserByName(username: string): Data;
  createUser({ email, pass, username, confirmationCode }: ICreatingUser): Data;
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
  confirmationCode: string;
}

interface IUpdatingUser {
  userId: number;
  email: string;
  pass: string;
  username: string;
  avatar: string;
}