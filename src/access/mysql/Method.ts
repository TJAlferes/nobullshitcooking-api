import { Pool, RowDataPacket } from 'mysql2/promise';

export class Method implements IMethod {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewByName = this.viewByName.bind(this);
  }

  async view() {
    const sql = `SELECT name FROM methods`;
    const [ methods ] = await this.pool.execute<RowDataPacket[]>(sql);
    return methods;
  }

  async viewByName(name: string) {
    const sql = `SELECT name FROM methods WHERE name = ?`;
    const [ method ] = await this.pool.execute<RowDataPacket[]>(sql, [name]);
    return method;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IMethod {
  pool: Pool;
  view(): Data;
  viewByName(name: string): Data;
}