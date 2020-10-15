import { Pool, RowDataPacket } from 'mysql2/promise';

export class IngredientType implements IIngredientType {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view() {
    const sql = `SELECT id, name FROM ingredient_types`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    //await this.pool.end();  // ? it uses release for you
    return rows;
  }

  async viewById(id: number) {
    const sql = `SELECT id, name FROM ingredient_types WHERE id = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    //await this.pool.end();
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IIngredientType {
  pool: Pool;
  view(): Data;
  viewById(id: number): Data;
}