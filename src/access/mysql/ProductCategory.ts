import { Pool, RowDataPacket } from 'mysql2/promise';

export class ProductCategory implements IProductCategory {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool =    pool;
    this.viewAll = this.viewAll.bind(this);
    this.viewOne = this.viewOne.bind(this);
  }

  async viewAll() {
    const sql = `SELECT id, name FROM product_categories`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    return rows;
  }

  async viewOne(id: string) {
    const sql = `SELECT id, name FROM product_categories WHERE id = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IProductCategory {
  pool:                Pool;
  viewAll():           Data;
  viewOne(id: string): Data;
}