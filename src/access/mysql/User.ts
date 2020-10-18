import { Pool, RowDataPacket } from 'mysql2/promise';

export class User implements IUser {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getByEmail = this.getByEmail.bind(this);  // sensitive
    this.getByName = this.getByName.bind(this);  // sensitive
    this.viewByName = this.viewByName.bind(this);
    this.create = this.create.bind(this);
    this.verify = this.verify.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  // sensitive
  async getByEmail(email: string) {
    const sql = `
      SELECT email, pass, username, avatar, confirmation_code
      FROM users
      WHERE email = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [email]);
    return row;
  }

  // sensitive
  async getByName(username: string) {
    const sql = `SELECT email, pass, username FROM users WHERE username = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [username]);
    return row;
  }

  async viewByName(username: string) {
    const sql = `SELECT username, avatar FROM users WHERE username = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [username]);
    return row;
  }

  async create({ email, pass, username, confirmationCode }: ICreatingUser) {
    const sql = `
      INSERT INTO users (email, pass, username, confirmation_code)
      VALUES (?, ?, ?, ?)
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [email, pass, username, confirmationCode]);
    return row;
  }

  async verify(email: string) {
    const sql = `
      UPDATE users SET confirmation_code = NULL WHERE email = ? LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [email]);
    return row;
  }

  async update({ email, pass, username, avatar }: IUpdatingUser) {
    const sql = `
      UPDATE users
      SET email = ?, pass = ?, username = ?, avatar = ?
      WHERE username = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [email, pass, username, avatar]);
    return row;
  }

  async delete(username: string) {
    const sql = `DELETE FROM users WHERE username = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [username]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IUser {
  pool: Pool;
  getByEmail(email: string): Data;
  getByName(username: string): Data;
  viewByName(username: string): Data;
  create({email, pass, username, confirmationCode}: ICreatingUser): Data;
  verify(email: string): Data;
  update({email, pass, username, avatar}: IUpdatingUser): Data;
  delete(username: string): Data;
}

interface ICreatingUser {
  email: string;
  pass: string;
  username: string;
  confirmationCode: string;
}

interface IUpdatingUser {
  email: string;
  pass: string;
  username: string;
  avatar: string;
}