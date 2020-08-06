import { Pool, RowDataPacket } from 'mysql2/promise';

export class RecipeType implements IRecipeType {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async view() {
    const sql = `SELECT id, name FROM recipe_types`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    return rows;
  }

  async viewById(id: number) {
    const sql = `SELECT id, name FROM recipe_types WHERE id = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IRecipeType {
  pool: Pool;
  view(): Data;
  viewById(id: number): Data;
}