import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL';

export class FavoriteRecipeRepo extends MySQLRepo implements IFavoriteRecipeRepo {
  async viewByUserId(user_id: string) {
    const sql = `
      SELECT
        f.recipe_id,
        r.recipe_type_id,
        r.cuisine_id,
        r.owner_id,
        u.username AS author,
        r.title,
        i.image_filename
      FROM favorite_recipe f
      INNER JOIN recipe r        ON f.recipe_id = r.recipe_id
      INNER JOIN user u          ON r.author_id = u.user_id
      INNER JOIN recipe_image ri ON r.recipe_id = ri.recipe_id
      INNER JOIN image i         ON ri.image_id = i.image_id
      WHERE f.user_id = ?
      ORDER BY r.title
    `;
    const [ rows ] = await this.pool.execute<FavoriteRecipeView[]>(sql, [user_id]);
    return rows;
  }

  async insert(params: InsertParams) {
    await this.delete(params);
    const sql = `
      INSERT INTO favorite_recipe (user_id, recipe_id) 
      VALUES (:user_id, :recipe_id)
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async delete(params: DeleteParams) {
    const sql = `
      DELETE FROM favorite_recipe
      WHERE user_id = :user_id AND recipe_id = :recipe_id
      LIMIT 1
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteAllByRecipeId(recipe_id: string) {
    const sql = `DELETE FROM favorite_recipe WHERE recipe_id = ?`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [recipe_id]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteAllByUserId(user_id: string) {
    const sql = `DELETE FROM favorite_recipe WHERE user_id = ?`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [user_id]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
}

export interface IFavoriteRecipeRepo {
  viewByUserId:        (user_id: string) =>      Promise<FavoriteRecipeView[]>;
  insert:              (params: InsertParams) => Promise<void>;
  delete:              (params: DeleteParams) => Promise<void>;
  deleteAllByRecipeId: (recipe_id: string) =>    Promise<void>;
  deleteAllByUserId:   (user_id: string) =>      Promise<void>;
}

type FavoriteRecipeView = RowDataPacket & {
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
