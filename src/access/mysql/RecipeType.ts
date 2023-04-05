import { Pool, RowDataPacket } from 'mysql2/promise';

export class RecipeTypeRepository implements IRecipeTypeRepository {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewAll() {
    const sql = `SELECT id, name FROM recipe_types`;
    const [ rows ] = await this.pool.execute<RecipeType[]>(sql);
    return rows;
  }

  async viewOne(id: number) {
    const sql = `SELECT id, name FROM recipe_types WHERE id = ?`;
    const [ row ] = await this.pool.execute<RecipeType[]>(sql, [id]);
    return row;
  }
}

export interface IRecipeTypeRepository {
  pool:    Pool;
  viewAll: () =>           Promise<RecipeType[]>;
  viewOne: (id: number) => Promise<RecipeType[]>;
}

type RecipeType = RowDataPacket & {
  id:   number;
  name: string;
};
