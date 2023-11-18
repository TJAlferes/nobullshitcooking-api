import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../shared/MySQL';

export class UserRepo extends MySQLRepo implements UserRepoInterface {
  async getPassword(email: string): Promise<string | undefined> {
    const sql = `SELECT password FROM user WHERE email = ?`;
    const [ [ row ] ] = await this.pool.query<PasswordData[]>(sql, [email]);
    return row.password;
  }  // be very careful with this, never expose

  async getByUserId(user_id: string): Promise<UserData | undefined> {
    const sql = `
      SELECT user_id, email, username, confirmation_code
      FROM user
      WHERE user_id = ?
    `;
    const [ [ row ] ] = await this.pool.query<UserData[]>(sql, [user_id]);
    return row;
  }

  async getByEmail(email: string): Promise<UserData | undefined> {
    const sql = `
      SELECT user_id, email, username, confirmation_code
      FROM user
      WHERE email = ?
    `;
    const [ [ row ] ] = await this.pool.query<UserData[]>(sql, [email]);
    return row;
  }

  async getByUsername(username: string): Promise<UserData | undefined> {
    const sql = `
      SELECT user_id, email, username, confirmation_code
      FROM user
      WHERE username = ?
    `;
    const [ [ row ] ] = await this.pool.execute<UserData[]>(sql, [username]);
    return row;
  }

  async getByConfirmationCode(confirmation_code: string): Promise<UserData | undefined> {
    const sql = `
      SELECT user_id, email, username, confirmation_code
      FROM user
      WHERE confirmation_code = ?
    `;
    const [ [ row ] ] = await this.pool.execute<UserData[]>(sql, [confirmation_code]);
    return row;
  }

  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO user (user_id, email, password, username, confirmation_code)
      VALUES (:user_id, :email, :password, :username, :confirmation_code)
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async update({ user_id, email, password, username, confirmation_code }: UpdateParams) {
    const sql = `
      UPDATE user
      SET
        email             = ?,
        password          = ?,
        username          = ?,
        confirmation_code = ?
      WHERE user_id = ?
      LIMIT 1
    `;
    await this.pool.execute(sql, [
      email,
      password,
      username,
      confirmation_code,
      user_id
    ]);
    /*const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [
      email,
      password,
      username,
      confirmation_code,
      user_id
    ]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');*/
  }

  async delete(user_id: string) {
    const sql = `DELETE FROM user WHERE user_id = ? LIMIT 1`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [user_id]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
}

export interface UserRepoInterface {
  getPassword:           (email: string) =>             Promise<string | undefined>;
  getByUserId:           (user_id: string) =>           Promise<UserData | undefined>;
  getByEmail:            (email: string) =>             Promise<UserData | undefined>;
  getByUsername:         (username: string) =>          Promise<UserData | undefined>;
  getByConfirmationCode: (confirmation_code: string) => Promise<UserData | undefined>;
  insert:                (params: InsertParams) =>      Promise<void>;
  update:                (params: UpdateParams) =>      Promise<void>;
  delete:                (user_id: string) =>           Promise<void>;
}

type PasswordData = RowDataPacket & {
  password: string;
};

export type UserData = RowDataPacket & {
  user_id:           string;
  email:             string;
  username:          string;
  confirmation_code: string | null;
};

type InsertParams = {
  user_id:           string;
  email:             string;
  password:          string;
  username:          string;
  confirmation_code: string;
};

type UpdateParams = {
  user_id:           string;
  email:             string;
  password:          string;
  username:          string;
  confirmation_code: string | null;
};
