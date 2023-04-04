import { Pool, RowDataPacket } from 'mysql2/promise';

export class User implements IUser {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getByEmail = this.getByEmail.bind(this);  // security sensitive, do NOT send back in the api response
    this.getByName =  this.getByName.bind(this);   // security sensitive, do NOT send back in the api response
    this.viewById =   this.viewById.bind(this);
    this.viewByName = this.viewByName.bind(this);
    this.create =     this.create.bind(this);
    this.verify =     this.verify.bind(this);
    this.update =     this.update.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  async getByEmail(email: string) {
    const sql = `SELECT id, email, pass, username, confirmation_code FROM users WHERE email = ?`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [email]);
    return row;
  }

  async getByName(username: string) {
    const sql = `SELECT id, email, pass, username, confirmation_code FROM users WHERE username = ?`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [username]);
    return row;
  }

  async viewById(id: number) {
    const sql = `SELECT username FROM users WHERE id = ?`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }

  async viewByName(username: string) {
    const sql = `SELECT id FROM users WHERE username = ?`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [username]);
    return row;
  }

  async create({ email, pass, username, confirmationCode }: ICreatingUser) {
    const sql = `INSERT INTO users (email, pass, username, confirmation_code) VALUES (?, ?, ?, ?)`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [email, pass, username, confirmationCode]);
    return row;
  }

  async verify(email: string) {
    const sql = `UPDATE users SET confirmation_code = NULL WHERE email = ? LIMIT 1`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [email]);
    return row;
  }

  async update({ id, email, pass, username }: IUpdatingUser) {
    const sql = `UPDATE users SET email = ?, pass = ?, username = ? WHERE id = ? LIMIT 1`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [email, pass, username, id]);
    return row;
  }

  async deleteById(id: number) {
    const sql = `DELETE FROM users WHERE id = ? LIMIT 1`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }
}

type Row = Promise<RowDataPacket>;

export interface IUser {
  pool:       Pool;
  getByEmail: (email: string) => Row;
  getByName:  (username: string) => Row;
  viewById:   (userId: number) => Row;
  viewByName: (username: string) => Row;
  create:     (user: ICreatingUser) => Row;
  verify:     (email: string) => Row;
  update:     (user: IUpdatingUser) => Row;
  deleteById: (userId: number) => Row;
}

interface ICreatingUser {
  email:            string;
  pass:             string;
  username:         string;
  confirmationCode: string;
}

interface IUpdatingUser {
  id:       number;
  email:    string;
  pass:     string;
  username: string;
}
