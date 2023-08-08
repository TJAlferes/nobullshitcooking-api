import { Pool, RowDataPacket } from 'mysql2/promise';

import { UserTableRow } from '../../../../types';
import { MySQLRepo } from './MySQL';

// TO DO: make only one specific explicit method for getting password ???

export class UserRepo extends MySQLRepo implements IUserRepo {
  // security sensitive, do NOT send back in the api response
  async getByEmail(email: string) {
    const sql = `SELECT id, email, password, username, confirmation_code FROM users WHERE email = ?`;
    const [ [ row ] ] = await this.pool.query<RowDataPacket[]>(sql, [email]);
    // if (!row) throw ???
    return row as UserTableRow;
  }

  // security sensitive, do NOT send back in the api response
  async getByName(username: string) {
    const sql = `SELECT id, email, password, username, confirmation_code FROM users WHERE username = ?`;
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

  async create({ id, email, password, username, confirmationCode }: UserTableRow) {
    const sql = `INSERT INTO users (id, email, pass, username, confirmation_code) VALUES (?, ?, ?, ?)`;
    await this.pool.execute<RowDataPacket[]>(sql, [id, email, password, username, confirmationCode]);
  }

  async verify(email: string) {
    const sql = `UPDATE users SET confirmation_code = NULL WHERE email = ? LIMIT 1`;
    await this.pool.execute<RowDataPacket[]>(sql, [email]);
  }

  async update(params: UserTableRow) {
    const sql = `
      UPDATE users
      SET
        email             = :email,
        password          = :password,
        username          = :username,
        confirmation_code = :confirmationCode
      WHERE id = :id
      LIMIT 1
    `;
    await this.pool.execute(sql, params);
  }

  async deleteById(id: number) {
    const sql = `DELETE FROM users WHERE id = ? LIMIT 1`;
    await this.pool.execute(sql, [id]);
  }
}

export interface IUserRepo {
  pool:       Pool;
  getByEmail: (email: string) =>      Promise<UserTableRow>;
  getByName:  (username: string) =>   Promise<User>;
  viewById:   (userId: number) =>     Promise<Username>;
  viewByName: (username: string) =>   Promise<UserId>;
  create:     (user: UserTableRow) => Promise<void>;
  verify:     (email: string) =>      Promise<void>;
  update:     (user: UserTableRow) => Promise<void>;
  deleteById: (userId: number) =>     Promise<void>;
}

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
