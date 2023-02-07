import { Pool, RowDataPacket } from 'mysql2/promise';

export class Measurement implements IMeasurement {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =    pool;
    this.viewAll = this.viewAll.bind(this);
    this.viewOne = this.viewOne.bind(this);
  }

  async viewAll() {
    const sql = `SELECT id, name FROM measurements`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    return rows;
  }

  async viewOne(id: number) {
    const sql = `SELECT id, name FROM measurements WHERE id = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IMeasurement {
  pool:                Pool;
  viewAll():           Data;
  viewOne(id: number): Data;
}