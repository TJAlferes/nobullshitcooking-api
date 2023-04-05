import { Pool, RowDataPacket } from 'mysql2/promise';

export class MethodRepository implements IMethodRepository {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewAll() {
    const sql = `SELECT id, name FROM methods`;
    const [ methods ] = await this.pool.execute<Method[]>(sql);
    return methods;
  }

  async viewOne(id: number) {
    const sql = `SELECT id, name FROM methods WHERE id = ?`;
    const [ method ] = await this.pool.execute<Method[]>(sql, [id]);
    return method;
  }
}

export interface IMethodRepository {
  pool:    Pool;
  viewAll: () =>           Promise<Method[]>;
  viewOne: (id: number) => Promise<Method[]>;
}

type Method = RowDataPacket & {
  id:   number;
  name: string;
};
