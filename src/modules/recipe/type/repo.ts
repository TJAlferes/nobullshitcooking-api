import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL';

export class RecipeTypeRepo extends MySQLRepo implements RecipeTypeRepoInterface {
  async viewAll() {
    const sql = `SELECT recipe_type_id, recipe_type_name FROM recipe_type`;
    const [ rows ] = await this.pool.execute<RecipeTypeView[]>(sql);
    return rows;
  }

  async viewOne(recipe_type_id: number) {
    const sql = `SELECT recipe_type_id, recipe_type_name FROM recipe_type WHERE recipe_type_id = ?`;
    const [ [ row ] ] = await this.pool.execute<RecipeTypeView[]>(sql, [recipe_type_id]);
    return row;
  }
}

export interface RecipeTypeRepoInterface {
  viewAll: () =>                       Promise<RecipeTypeView[]>;
  viewOne: (recipe_type_id: number) => Promise<RecipeTypeView>;
}

type RecipeTypeView = RowDataPacket & {
  recipe_type_id:   number;
  recipe_type_name: string;
};
