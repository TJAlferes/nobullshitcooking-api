import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL';

export class SavedRecipeRepo extends MySQLRepo implements ISavedRecipeRepo {
  async viewByUserId(user_id: string) {
    const sql = `
      SELECT 
        s.recipe_id,
        r.recipe_type_id,
        r.cuisine_id,
        r.owner_id,
        u.username AS author,
        r.title,
        i.image_filename
      FROM saved_recipe s
      INNER JOIN recipe r ON r.recipe_id = s.recipe_id
      INNER JOIN user u   ON u.user_id = r.author_id
      INNER JOIN image i  ON i.image_id = r.image_id
      WHERE s.user_id = ?
      ORDER BY r.title
    `;
    const [ rows ] = await this.pool.execute<SavedRecipeView[]>(sql, [user_id]);
    return rows;
  }

  async insert(params: InsertParams) {
    await this.delete(params);
    const sql = `
      INSERT INTO saved_recipe (user_id, recipe_id)
      VALUES (:user_id, :recipe_id)
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async delete(params: DeleteParams) {
    const sql = `
      DELETE FROM saved_recipe
      WHERE user_id = :user_id AND recipe_id = :recipe_id
      LIMIT 1
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteAllByRecipeId(recipe_id: string) {
    const sql = `DELETE FROM saved_recipe WHERE recipe_id = ?`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [recipe_id]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteAllByUserId(user_id: string) {
    const sql = `DELETE FROM saved_recipe WHERE user_id = ?`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [user_id]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
}

export interface ISavedRecipeRepo {
  viewByUserId:        (user_id: string) =>      Promise<SavedRecipeView[]>;
  insert:              (params: InsertParams) => Promise<void>;
  delete:              (params: DeleteParams) => Promise<void>;
  deleteAllByRecipeId: (recipe_id: string) =>    Promise<void>;
  deleteAllByUserId:   (user_id: string) =>      Promise<void>;
}

type SavedRecipeView = RowDataPacket & {
  recipe_id:      string;
  recipe_type_id: number;
  cuisine_id:     number;
  owner_id:       string;
  author:         string;
  title:          string;
  image_filename: string;
};

type InsertParams = {
  user_id:   string;
  recipe_id: string;
};

type DeleteParams = {
  user_id:   string;
  recipe_id: string;
};
