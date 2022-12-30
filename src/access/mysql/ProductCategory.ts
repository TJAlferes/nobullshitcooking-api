import { Pool, RowDataPacket } from 'mysql2/promise';

export class ProductCategory implements IProductCategory {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view =     this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view() {
    const sql = `SELECT id, name FROM product_categories`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    return rows;
  }

  async viewById(id: string) {
    const sql = `SELECT id, name FROM product_categories WHERE id = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IProductCategory {
  pool: Pool;
  view(): Data;
  viewById(id: string): Data;
}