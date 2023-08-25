import { RowDataPacket } from 'mysql2/promise';

import { UserTableRow } from '../../../../types';
import { MySQLRepo } from '../shared/MySQL';

// TO DO: make only one specific explicit method for getting password ???

export class UserRepo extends MySQLRepo implements IUserRepo {
  async getById(user_id: string) {
    const sql = `SELECT user_id, email, password, username, confirmation_code FROM users WHERE user_id = ?`;
    const [ [ row ] ] = await this.pool.query<RowDataPacket[]>(sql, [user_id]);
    // if (!row) throw ???
    return row as UserTableRow;
  }

  async getByEmail(email: string) {  // security sensitive, do NOT send back in the api response
    const sql = `SELECT user_id, email, password, username, confirmation_code FROM users WHERE email = ?`;
    const [ [ row ] ] = await this.pool.query<RowDataPacket[]>(sql, [email]);
    // if (!row) throw ???
    return row as UserTableRow;
  }

  async getByUsername(username: string) {  // security sensitive, do NOT send back in the api response
    const sql = `SELECT user_id, email, password, username, confirmation_code FROM users WHERE username = ?`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [username]);
    return row as UserTableRow;
  }

  async getByConfirmationCode(confirmation_code: string) {
    const sql = `SELECT user_id, email, password, username, confirmation_code FROM users WHERE confirmation_code = ?`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [confirmation_code]);
    return row as UserTableRow;
  }

  /*async viewById(user_id: string) {
    const sql = `SELECT email, username FROM users WHERE user_id = ?`;
    const [ [ row ] ] = await this.pool.execute<Username[]>(sql, [user_id]);
    return row;
  }

  async viewByEmail(email: string) {
    const sql = `SELECT username FROM users WHERE email = ?`;
    const [ [ row ] ] = await this.pool.execute<Username[]>(sql, [user_id]);
    return row;
  }

  async viewByUsername(username: string) {
    const sql = `SELECT email FROM users WHERE username = ?`;
    const [ [ row ] ] = await this.pool.execute<UserId[]>(sql, [username]);
    return row;
  }*/

  async insert(params: UserTableRow) {
    const sql = `
      INSERT INTO users (user_id, email, password, username, confirmation_code)
      VALUES (:user_id, :email, :password, :username, :confirmation_code)
    `;
    await this.pool.execute<RowDataPacket[]>(sql, params);
  }

  /*async verify(email: string) {  // get rid of this, just do this with update()
    const sql = `UPDATE users SET confirmation_code = NULL WHERE email = ? LIMIT 1`;
    await this.pool.execute<RowDataPacket[]>(sql, [email]);
  }*/

  async update(params: UserTableRow) {
    const sql = `
      UPDATE users
      SET
        email             = :email,
        password          = :password,
        username          = :username,
        confirmation_code = :confirmation_code
      WHERE user_id = :user_id
      LIMIT 1
    `;
    await this.pool.execute(sql, params);
  }

  async delete(user_id: string) {
    const sql = `DELETE FROM users WHERE user_id = ? LIMIT 1`;
    await this.pool.execute(sql, [user_id]);
  }
}

export interface IUserRepo {
  getById:               (user_id: string) =>           Promise<UserTableRow>
  getByEmail:            (email: string) =>             Promise<UserTableRow>;
  getByUsername:         (username: string) =>          Promise<UserTableRow>;
  getByConfirmationCode: (confirmation_code: string) => Promise<UserTableRow>;
  //viewById:              (user_id: number) =>           Promise<Username>;
  //viewByUsername:        (username: string) =>          Promise<UserId>;
  insert:                (user: UserTableRow) =>        Promise<void>;
  //verify:                (email: string) =>             Promise<void>;
  update:                (user: UserTableRow) =>        Promise<void>;
  delete:                (user_id: string) =>           Promise<void>;
}
