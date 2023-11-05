import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL.js';

export class RecipeImageRepo extends MySQLRepo implements RecipeImageRepoInterface {
  async viewByRecipeId(recipe_id: string) {
    const sql = `
      SELECT ri.type, i.image_filename, i.caption
      FROM recipe_image ri
      INNER JOIN image i ON i.image_id = ri.image_id
      WHERE ri.recipe_id = ?
    `;
    const [ rows ] = await this.pool.execute<RecipeImageView[]>(sql, [recipe_id]);
    return rows;
  }

  async bulkInsert({ placeholders, recipe_images }: BulkInsertParams) {
    const sql = `
      INSERT INTO recipe_image (recipe_id, image_id, type)
      VALUES ${placeholders}
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, recipe_images);
    if (!result) throw new Error('Query not successful.');
  }

  // TO DO: if not needed, delete this code...
  //async bulkUpdate({ recipe_id, placeholders, recipe_images }: BulkUpdateParams) {
  //  // Rather than updating current values in the database, we delete them,
  //  // and if there are new values, we insert them.
  //  const conn = await this.pool.getConnection();
  //  await conn.beginTransaction();
  //  try {
  //    let sql = `DELETE FROM recipe_image WHERE recipe_id = ?`;
  //    await conn.query(sql, [recipe_id]);
  //    if (recipe_images.length) {
  //      let sql = `
  //      INSERT INTO recipe_image (recipe_id, image_id, type)
  //      VALUES ${placeholders}
  //      `;
  //      await conn.query(sql, recipe_images);
  //    }
  //    await conn.commit();
  //  } catch (err) {
  //    await conn.rollback();
  //    throw err;
  //  } finally {
  //    conn.release();
  //  }
  //}

  async deleteByImageId(image_id: string) {
    const sql = `DELETE FROM recipe_image WHERE image_id = ? LIMIT 1`;
    await this.pool.execute(sql, [image_id]);
  }

  async deleteByRecipeId(recipe_id: string) {
    const sql = `DELETE FROM recipe_image WHERE recipe_id = ?`;
    await this.pool.execute(sql, [recipe_id]);
  }
}

export interface RecipeImageRepoInterface {
  viewByRecipeId:   (recipe_id: string) =>        Promise<RecipeImageView[]>;
  bulkInsert:       (params: BulkInsertParams) => Promise<void>;
  //bulkUpdate:       (params: BulkUpdateParams) => Promise<void>;
  deleteByImageId:  (image_id: string) =>         Promise<void>;
  deleteByRecipeId: (recipe_id: string) =>        Promise<void>;
}

type RecipeImageRow = {
  recipe_id: string;
  image_id:  string;
  type:      number;  // 1|2|3|4
};

type BulkInsertParams = {
  placeholders:  string;
  recipe_images: RecipeImageRow[];
};

type BulkUpdateParams = BulkInsertParams & {
  recipe_id: string;
};

type RecipeImageView = RowDataPacket & {
  type:           number;  // 1 "primary/main/face/presentation/recipe" | 2 "equipment" | 3 "ingredients" | 4 "detail/action/step/process/preparing/cooking"
  image_filename: string;
  caption:        string;
};
