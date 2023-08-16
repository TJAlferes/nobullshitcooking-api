import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from './MySQL';

export class IngredientTypeRepo extends MySQLRepo implements IIngredientTypeRepo {
  async viewAll() {
    const sql = `SELECT ingredient_type_id, ingredient_type_name FROM ingredient_type`;
    const [ rows ] = await this.pool.execute<IngredientTypeView[]>(sql);
    return rows;
  }

  async viewOne(ingredient_type_id: number) {
    const sql = `SELECT ingredient_type_id, ingredient_type_name FROM ingredient_type WHERE ingredient_type_id = ?`;
    const [ [ row ] ] = await this.pool.execute<IngredientTypeView[]>(sql, [ingredient_type_id]);
    return row;
  }
}

export interface IIngredientTypeRepo {
  viewAll: () =>                           Promise<IngredientTypeView[]>;
  viewOne: (ingredient_type_id: number) => Promise<IngredientTypeView>;
}

type IngredientTypeView = RowDataPacket & {
  ingredient_type_id:   number;
  ingredient_type_name: string;
};
