import { Pool, RowDataPacket } from 'mysql2/promise';

export class Method implements IMethod {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view() {
    const sql = `SELECT id, name FROM methods`;
    const [ methods ] = await this.pool.execute<RowDataPacket[]>(sql);
    return methods;
  }

  async viewById(id: number) {
    const sql = `SELECT id, name FROM methods WHERE id = ?`;
    const [ method ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return method;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IMethod {
  pool: Pool;
  view(): Data;
  viewById(id: number): Data;
}