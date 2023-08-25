import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL';

export class RecipeImageRepo extends MySQLRepo implements IRecipeImageRepo {
  async viewByRecipeId(recipe_id: string) {

  }

  async insert(params: InsertParams) {
    `recipe_id, image_id, recipe_image_type_id, order`
  }

  async update(params: InsertParams) {

  }

  async deleteByImageId(image_id: string) {
    const sql = `DELETE FROM recipe_image WHERE image_id = ?`;
    await this.pool.execute(sql, [image_id]);
  }

  async deleteByRecipeId(recipe_id: string) {
    const sql = `DELETE FROM recipe_image WHERE recipe_id = ?`;
    await this.pool.execute(sql, [recipe_id]);
  }

  /* not needed because of ON CASCADE DELETE ???
  async deleteByRecipeIds(recipe_ids: string[]) {

  }*/
}

interface IRecipeImageRepo {

}

type InsertParams = {

};
