import { Pool, RowDataPacket } from 'mysql2/promise';

export class UserRepository implements IUserRepository {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // security sensitive, do NOT send back in the api response
  async getByEmail(email: string) {
    const sql = `SELECT id, email, pass, username, confirmation_code FROM users WHERE email = ?`;
    const [ [ row ] ] = await this.pool.execute<User[]>(sql, [email]);
    return row;
  }

  // security sensitive, do NOT send back in the api response
  async getByName(username: string) {
    const sql = `SELECT id, email, pass, username, confirmation_code FROM users WHERE username = ?`;
    const [ [ row ] ] = await this.pool.execute<User[]>(sql, [username]);
    return row;
  }

  async viewById(id: number) {  // rename to getUsername
    const sql = `SELECT username FROM users WHERE id = ?`;
    const [ [ row ] ] = await this.pool.execute<Username[]>(sql, [id]);
    return row;
  }

  async viewByName(username: string) {  // rename to getUserId
    const sql = `SELECT id FROM users WHERE username = ?`;
    const [ [ row ] ] = await this.pool.execute<UserId[]>(sql, [username]);
    return row;
  }

  async create({ email, pass, username, confirmationCode }: CreatingUser) {
    const sql = `INSERT INTO users (email, pass, username, confirmation_code) VALUES (?, ?, ?, ?)`;
    await this.pool.execute<RowDataPacket[]>(sql, [email, pass, username, confirmationCode]);
  }

  async verify(email: string) {
    const sql = `UPDATE users SET confirmation_code = NULL WHERE email = ? LIMIT 1`;
    await this.pool.execute<RowDataPacket[]>(sql, [email]);
  }

  async update({ id, email, pass, username }: UpdatingUser) {
    const sql = `UPDATE users SET email = ?, pass = ?, username = ? WHERE id = ? LIMIT 1`;
    await this.pool.execute(sql, [email, pass, username, id]);
  }

  async deleteById(id: number) {
    const sql = `DELETE FROM users WHERE id = ? LIMIT 1`;
    await this.pool.execute(sql, [id]);
  }
}

export interface IUserRepository {
  pool:       Pool;
  getByEmail: (email: string) =>      Promise<User>;
  getByName:  (username: string) =>   Promise<User>;
  viewById:   (userId: number) =>     Promise<Username>;
  viewByName: (username: string) =>   Promise<UserId>;
  create:     (user: CreatingUser) => Promise<void>;
  verify:     (email: string) =>      Promise<void>;
  update:     (user: UpdatingUser) => Promise<void>;
  deleteById: (userId: number) =>     Promise<void>;
}

type CreatingUser = {
  email:            string;
  pass:             string;
  username:         string;
  confirmationCode: string;
};

type UpdatingUser = {
  id:       number;
  email:    string;
  pass:     string;
  username: string;
};

type User = RowDataPacket & {
  id:       number;
  email:    string;
  pass:     string;
  username: string;
  confirmationCode: string;
};

type UserId = RowDataPacket & {
  id: string;
};

type Username = RowDataPacket & {
  username: string;
};
