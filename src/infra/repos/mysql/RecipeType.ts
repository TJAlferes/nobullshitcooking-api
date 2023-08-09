import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from './MySQL';

export class RecipeTypeRepo extends MySQLRepo implements IRecipeTypeRepo {
  async viewAll() {
    const sql = `SELECT id, name FROM recipe_type`;
    const [ rows ] = await this.pool.execute<RecipeType[]>(sql);
    return rows;
  }

  async viewOne(id: number) {
    const sql = `SELECT id, name FROM recipe_type WHERE id = ?`;
    const [ row ] = await this.pool.execute<RecipeType[]>(sql, [id]);
    return row;
  }
}

export interface IRecipeTypeRepo {
  viewAll: () =>           Promise<RecipeType[]>;
  viewOne: (id: number) => Promise<RecipeType[]>;
}

type RecipeType = RowDataPacket & {
  id:   number;
  name: string;
};
