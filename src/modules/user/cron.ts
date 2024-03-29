import { pool } from '../../connections/mysql';

export const userCron = {
  async deleteStaleUnconfirmed() {
    let conn;

    try {

      conn = await pool.getConnection();

      const sql = `
        DELETE FROM user
        WHERE created_at <= DATE_SUB(NOW(), INTERVAL 7 DAY)
        AND confirmation_code IS NOT NULL;
      `;

      const [ rows ] = await conn.query(sql);

      conn.release();

      if (!rows) {
        throw new Error('deleteStaleUnconfirmed failed');
      }

      console.log('deleteStaleUnconfirmed succeeded');

    } catch (error) {

      console.error('deleteStaleUnconfirmed failed:', error);

    } finally {

      if (conn) {
        conn.release();
      }

    }
  }
};
