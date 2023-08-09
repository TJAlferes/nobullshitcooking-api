import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from './MySQL';

export class IngredientTypeRepo extends MySQLRepo implements IIngredientTypeRepo {
  async viewAll() {
    const sql = `SELECT id, name FROM ingredient_type`;
    const [ rows ] = await this.pool.execute<IngredientType[]>(sql);
    return rows;
  }

  async viewOne(id: number) {
    const sql = `SELECT id, name FROM ingredient_type WHERE id = ?`;
    const [ row ] = await this.pool.execute<IngredientType[]>(sql, [id]);
    return row;
  }
}

export interface IIngredientTypeRepo {
  viewAll: () =>           Promise<IngredientType[]>;
  viewOne: (id: number) => Promise<IngredientType[]>;
}

type IngredientType = RowDataPacket & {
  id:   number;
  name: string;
};
