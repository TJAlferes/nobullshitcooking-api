import { Pool, RowDataPacket } from 'mysql2/promise';

export class Method implements IMethod {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewMethods = this.viewMethods.bind(this);
    this.viewMethodById = this.viewMethodById.bind(this);
  }

  async viewMethods() {
    const sql = `
      SELECT method_id, method_name
      FROM nobsc_methods
    `;
    const [ allMethods ] = await this.pool.execute<RowDataPacket[]>(sql);
    return allMethods;
  }

  async viewMethodById(methodId: number) {
    const sql = `
      SELECT method_id, method_name
      FROM nobsc_methods
      WHERE method_id = ?
    `;
    const [ method ] = await this.pool
    .execute<RowDataPacket[]>(sql, [methodId]);
    return method;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IMethod {
  pool: Pool;
  viewMethods(): Data;
  viewMethodById(methodId: number): Data;
}