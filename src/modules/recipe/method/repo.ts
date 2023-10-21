import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL.js';

export class MethodRepo extends MySQLRepo implements MethodRepoInterface {
  async viewAll() {
    const sql = `SELECT method_id, method_name FROM method`;
    const [ rows ] = await this.pool.execute<MethodView[]>(sql);
    return rows;
  }

  async viewOne(method_id: number) {
    const sql = `SELECT method_id, method_name FROM method WHERE method_id = ?`;
    const [ [ row ] ] = await this.pool.execute<MethodView[]>(sql, [method_id]);
    return row;
  }
}

export interface MethodRepoInterface {
  viewAll: () =>                  Promise<MethodView[]>;
  viewOne: (method_id: number) => Promise<MethodView>;
}

type MethodView = RowDataPacket & {
  method_id:   number;
  method_name: string;
};
