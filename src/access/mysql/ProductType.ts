import { Pool, RowDataPacket } from 'mysql2/promise';

export class ProductType implements IProductType {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewByName = this.viewByName.bind(this);
  }

  async view() {
    const sql = `SELECT name FROM product_types`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    return rows;
  }

  async viewByName(name: string) {
    const sql = `SELECT name FROM product_types WHERE name = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [name]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IProductType {
  pool: Pool;
  view(): Data;
  viewByName(name: string): Data;
}