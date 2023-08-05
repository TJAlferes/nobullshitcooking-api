import { Pool, RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from './MySQL';

export class MethodRepo extends MySQLRepo implements IMethodRepo {
  async viewAll() {
    const sql = `SELECT id, name FROM method`;
    const [ methods ] = await this.pool.execute<Method[]>(sql);
    return methods;
  }

  async viewOne(id: number) {
    const sql = `SELECT id, name FROM method WHERE id = ?`;
    const [ method ] = await this.pool.execute<Method[]>(sql, [id]);
    return method;
  }
}

export interface IMethodRepo {
  pool:    Pool;
  viewAll: () =>           Promise<Method[]>;
  viewOne: (id: number) => Promise<Method[]>;
}

type Method = RowDataPacket & {
  id:   number;
  name: string;
};
