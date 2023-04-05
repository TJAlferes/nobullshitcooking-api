import { Pool, RowDataPacket } from 'mysql2/promise';

export class IngredientTypeRepository implements IIngredientTypeRepository {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewAll() {
    const sql = `SELECT id, name FROM ingredient_types`;
    const [ rows ] = await this.pool.execute<IngredientType[]>(sql);
    return rows;
  }

  async viewOne(id: number) {
    const sql = `SELECT id, name FROM ingredient_types WHERE id = ?`;
    const [ row ] = await this.pool.execute<IngredientType[]>(sql, [id]);
    return row;
  }
}

export interface IIngredientTypeRepository {
  pool:    Pool;
  viewAll: () =>           Promise<IngredientType[]>;
  viewOne: (id: number) => Promise<IngredientType[]>;
}

type IngredientType = RowDataPacket & {
  id:   number;
  name: string;
};
