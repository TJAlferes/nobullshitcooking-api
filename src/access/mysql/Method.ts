import { Pool, RowDataPacket } from 'mysql2/promise';

export class Method implements IMethod {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =    pool;
    this.viewAll = this.viewAll.bind(this);
    this.viewOne = this.viewOne.bind(this);
  }

  async viewAll() {
    const sql = `SELECT id, name FROM methods`;
    const [ methods ] = await this.pool.execute<RowDataPacket[]>(sql);
    return methods;
  }

  async viewOne(id: number) {
    const sql = `SELECT id, name FROM methods WHERE id = ?`;
    const [ method ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return method;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IMethod {
  pool:                Pool;
  viewAll():           Data;
  viewOne(id: number): Data;
}