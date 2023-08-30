import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../shared/MySQL';

export class UserRepo extends MySQLRepo implements UserRepoInterface {
  async getPassword(email: string) {
    const sql = `SELECT password FROM users WHERE email = ?`;
    const [ [ row ] ] = await this.pool.query<PasswordData[]>(sql, [email]);
    return row.password;
  }  // ONLY for use in UserAuthenticationService.isCorrectPassword

  async getByUserId(user_id: string) {
    const sql = `
      SELECT user_id, email, username, confirmation_code
      FROM users
      WHERE user_id = ?
    `;
    const [ [ row ] ] = await this.pool.query<UserData[]>(sql, [user_id]);
    return row;
  }

  async getByEmail(email: string) {
    const sql = `
      SELECT user_id, email, username, confirmation_code
      FROM users
      WHERE email = ?
    `;
    const [ [ row ] ] = await this.pool.query<UserData[]>(sql, [email]);
    return row;
  }

  async getByUsername(username: string) {
    const sql = `
      SELECT user_id, email, username, confirmation_code
      FROM users
      WHERE username = ?
    `;
    const [ [ row ] ] = await this.pool.execute<UserData[]>(sql, [username]);
    return row;
  }

  async getByConfirmationCode(confirmation_code: string) {
    const sql = `
      SELECT user_id, email, username, confirmation_code
      FROM users
      WHERE confirmation_code = ?
    `;
    const [ [ row ] ] = await this.pool.execute<UserData[]>(sql, [confirmation_code]);
    return row;
  }

  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO users (user_id, email, password, username, confirmation_code)
      VALUES (:user_id, :email, :password, :username, :confirmation_code)
    `;
    await this.pool.execute<RowDataPacket[]>(sql, params);
  }

  async update(params: UpdateParams) {
    const sql = `
      UPDATE users
      SET
        email             = :email,
        password          = :password,
        username          = :username,
        password          = :password,
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

export interface UserRepoInterface {
  getPassword:           (email: string) =>             Promise<string>;
  getByUserId:           (user_id: string) =>           Promise<UserData>
  getByEmail:            (email: string) =>             Promise<UserData>;
  getByUsername:         (username: string) =>          Promise<UserData>;
  getByConfirmationCode: (confirmation_code: string) => Promise<UserData>;
  insert:                (params: InsertParams) =>      Promise<void>;
  update:                (params: UpdateParams) =>      Promise<void>;
  delete:                (user_id: string) =>           Promise<void>;
}

type PasswordData = RowDataPacket & {
  password: string;
};

type UserData = RowDataPacket & {
  user_id:           string;
  email:             string;
  username:          string;
  confirmation_code: string;
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
