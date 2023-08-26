import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL';

export class RecipeImageRepo extends MySQLRepo implements IRecipeImageRepo {
  async viewByRecipeId(recipe_id: string) {
    const sql = `
      SELECT ri.type, ri.order, i.image_url
      FROM recipe_image ri
      INNER JOIN image i ON i.image_id = ri.image_id
      WHERE ri.recipe_id = ?
    `;
    const [ rows ] = await this.pool.execute<RecipeImageView[]>(sql, [recipe_id]);
    return rows;
  }

  async insert({ placeholders, recipe_images }: InsertParams) {
    const sql = `
      INSERT INTO recipe_image (recipe_id, image_id, type, order)
      VALUES ${placeholders}
    `;
    await this.pool.execute(sql, recipe_images);
  }

  async update({ recipe_id, placeholders, recipe_images }: UpdateParams) {
    // Rather than updating current values in the database, we delete them,
    // and if there are new values, we insert them.
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();

    try {

      let sql = `DELETE FROM recipe_image WHERE recipe_id = ?`;

      await conn.query(sql, [recipe_id]);

      if (recipe_images.length) {
        let sql = `
        INSERT INTO recipe_image (recipe_id, image_id, type, order)
        VALUES ${placeholders}
        `;

        await conn.query(sql, recipe_images);
      }

      await conn.commit();

    } catch (err) {

      await conn.rollback();
      throw err;

    } finally {

      conn.release();

    }
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

export interface IRecipeImageRepo {
  viewByRecipeId: (recipe_id: string) =>    Promise<RecipeImageView[]>;
  insert:         (params: InsertParams) => Promise<void>;
  update:         (params: UpdateParams) => Promise<void>;
}

type RecipeImageRow = {
  recipe_id: string;
  image_id:  string;
  type:      number;  // 1 "primary/main/face/presentation/recipe" | 2 "equipment" | 3 "ingredients" | 4 "detail/action/step/process/preparing/cooking"
  order:     number;  // 1|2|3
};

type InsertParams = {
  placeholders:  string;
  recipe_images: RecipeImageRow[];
};

type UpdateParams = InsertParams & {
  recipe_id: string;
  image_id:  string;
};

type RecipeImageView = RowDataPacket & {
  type:      number;  // 1 "primary/main/face/presentation/recipe" | 2 "equipment" | 3 "ingredients" | 4 "detail/action/step/process/preparing/cooking"
  order:     number;  // 1|2|3
  image_url: string;
};
