import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../../shared/MySQL';

export class PasswordResetRepo extends MySQLRepo implements PasswordResetRepoInterface {
  async getPassword(user_id: string): Promise<string | undefined> {
    const sql = `SELECT temporary_password FROM password_reset WHERE user_id = ?`;
    const [ [ row ] ] = await this.pool.query<PasswordData[]>(sql, [user_id]);
    return row.temporary_password;
  }  // be very careful with this

  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO password_reset (reset_id, user_id, temporary_password)
      VALUES (:reset_id, :user_id, :temporary_password)
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteByUserId(user_id: string) {
    const sql = `DELETE FROM password_reset WHERE user_id = ?`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [user_id]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
}

export interface PasswordResetRepoInterface {
  getPassword:    (user_id: string) =>      Promise<string | undefined>;
  insert:         (params: InsertParams) => Promise<void>;
  deleteByUserId: (user_id: string) =>      Promise<void>;
}

type PasswordData = RowDataPacket & {
  temporary_password: string;
};

type InsertParams = {
  reset_id:           string;
  user_id:            string;
  temporary_password: string;
};
