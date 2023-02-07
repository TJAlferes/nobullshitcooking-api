import { Pool, RowDataPacket } from 'mysql2/promise';

export class Cuisine implements ICuisine {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =    pool;
    this.viewAll = this.viewAll.bind(this);
    this.viewOne = this.viewOne.bind(this);
  }

  async viewAll() {
    const sql = `SELECT id, name, nation FROM cuisines`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    return rows;
  }

  async viewOne(id: number) {
    const sql = `SELECT id, name, nation FROM cuisines WHERE id = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ICuisine {
  pool:                Pool;
  viewAll():           Data;
  viewOne(id: number): Data;
}