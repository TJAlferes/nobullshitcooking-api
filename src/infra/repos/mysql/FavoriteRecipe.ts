import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from './MySQL';

export class FavoriteRecipeRepo extends MySQLRepo implements IFavoriteRecipeRepo {
  async viewByUserId(userId: number) {
    const sql = `
      SELECT
        f.recipe_id AS id,
        r.title,
        r.recipe_image,
        r.owner_id,
        r.recipe_type_id,
        r.cuisine_id,
        u.username AS author
      FROM favorite_recipe f
      INNER JOIN recipe r ON r.id = f.recipe_id
      INNER JOIN user u ON u.id = r.author_id
      WHERE f.user_id = ?
      ORDER BY r.title
    `;
    const [ rows ] = await this.pool.execute<FavoriteRecipe[]>(sql, [userId]);
    return rows;
  }

  async create(userId: number, recipeId: number) {
    await this.delete(userId, recipeId);
    const sql = `INSERT INTO favorite_recipe (user_id, recipe_id) VALUES (?, ?)`;
    await this.pool.execute(sql, [userId, recipeId]);
  }

  async delete(userId: number, recipeId: number) {
    const sql = `DELETE FROM favorite_recipe WHERE user_id = ? AND recipe_id = ? LIMIT 1`;
    await this.pool.execute(sql, [userId, recipeId]);
  }

  async deleteAllByRecipeId(recipeId: number) {
    const sql = `DELETE FROM favorite_recipe WHERE recipe_id = ?`;
    await this.pool.execute(sql, [recipeId]);
  }

  async deleteAllByUserId(userId: number) {
    const sql = `DELETE FROM favorite_recipe WHERE user_id = ?`;
    await this.pool.execute(sql, [userId]);
  }
}

export interface IFavoriteRecipeRepo {
  viewByUserId:        (userId: number) =>                   Promise<FavoriteRecipe[]>;
  create:              (userId: number, recipeId: number) => Promise<void>;
  delete:              (userId: number, recipeId: number) => Promise<void>;
  deleteAllByRecipeId: (recipeId: number) =>                 Promise<void>;
  deleteAllByUserId:   (userId: number) =>                   Promise<void>;
}

type FavoriteRecipe = RowDataPacket & {
  id:             number;
  title:          string;
  recipe_image:   string;
  owner_id:       number;
  recipe_type_id: number;
  cuisine_id:     number;
  author:         string;
};
