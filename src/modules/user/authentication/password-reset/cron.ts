import { pool } from '../../../../connections/mysql';

export const passwordResetCron = {
  async deleteExpiredTemporaryPasswords() {
    let conn;

    try {

      conn = await pool.getConnection();

      const sql = `
        DELETE FROM password_reset
        WHERE created_at <= DATE_SUB(NOW(), INTERVAL 1 DAY);
      `;

      const [rows] = await conn.query(sql);

      conn.release();

      if (!rows) {
        throw new Error('deleteExpiredTemporaryPasswords failed');
      }

      console.log('deleteExpiredTemporaryPasswords succeeded');

    } catch (error) {

      console.error('deleteExpiredTemporaryPasswords failed:', error);

    } finally {

      if (conn) {
        conn.release();
      }

    }
  }
};
