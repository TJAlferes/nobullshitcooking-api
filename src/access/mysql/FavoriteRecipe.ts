import { Pool, RowDataPacket } from 'mysql2/promise';

export class FavoriteRecipe implements IFavoriteRecipe {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByUserId = this.viewByUserId.bind(this);
    //this.viewMost = this.viewMost.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteAllByRecipeId = this.deleteAllByRecipeId.bind(this);
    this.deleteAllByUserId = this.deleteAllByUserId.bind(this);
  }

  async viewByUserId(userId: number) {
    const sql = `
      SELECT 
        f.recipe_id,
        r.title,
        r.image,
        r.owner_id,
        r.recipe_type_id,
        r.cuisine_id
      FROM favorite_recipes f
      INNER JOIN recipes r ON r.id = f.recipe_id
      WHERE f.user_id = ?
      ORDER BY r.title
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [userId]);
    return rows;
  }

  /*async viewMost(limit: number) {
    //const sql = `
    //  SELECT recipe_id
    //  FROM favorite_recipes
    //  ORDER BY COUNT(user_id) DESC
    //  LIMIT ?
    //`;
    const sql = `
      SELECT recipe_id, COUNT(recipe_id) AS tally
      FROM favorite_recipes
      GROUP BY recipe_id
      ORDER BY tally DESC
      LIMIT ?
    `;
    const [ rows ] = this.pool.execute(sql, [limit]);
    return rows;
  }*/

  async create(userId: number, recipeId: number) {
    await this.delete(userId, recipeId);

    const sql = `
      INSERT INTO favorite_recipes (user_id, recipe_id) VALUES (?, ?)
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [userId, recipeId]);
    return row;
  }

  async delete(userId: number, recipeId: number) {
    const sql = `
      DELETE FROM favorite_recipes WHERE user_id = ? AND recipe_id = ? LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [userId, recipeId]);
    return row;
  }

  async deleteAllByRecipeId(recipeId: number) {
    const sql = `DELETE FROM favorite_recipes WHERE recipe_id = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async deleteAllByUserId(userId: number) {
    const sql = `DELETE FROM favorite_recipes WHERE user_id = ?`;
    await this.pool.execute<RowDataPacket[]>(sql, [userId]);
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IFavoriteRecipe {
  pool: Pool;
  //viewMost(): Data;
  viewByUserId(userId: number): Data;
  create(userId: number, recipeId: number): Data;
  delete(userId: number, recipeId: number): Data;
  deleteAllByRecipeId(recipeId: number): Data;
  deleteAllByUserId(userId: number): void;
}