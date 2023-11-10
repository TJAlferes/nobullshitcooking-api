import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../../shared/MySQL.js';

export class PasswordResetRepo extends MySQLRepo implements PasswordResetRepoInterface {
  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO password_reset (reset_id, user_id, temporary_password)
      VALUES (:reset_id, :user_id, :temporary_password)
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
}

export interface PasswordResetRepoInterface {
  insert: (params: InsertParams) => Promise<void>;
}

type InsertParams = {
  reset_id:           string;
  user_id:            string;
  temporary_password: string;
};
