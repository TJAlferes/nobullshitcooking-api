import { Pool, RowDataPacket } from 'mysql2/promise';

export class FavoriteRecipe implements IFavoriteRecipe {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByUserId = this.viewByUserId.bind(this);
    //this.viewMost = this.viewMost.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  async viewByUserId(user: string) {
    const sql = `
      SELECT 
        r.id,
        r.title,
        r.recipe_image,
        r.ownerId,
        r.type,
        r.cuisine
      FROM favorite_recipes f
      INNER JOIN recipes r ON r.id = f.recipeId
      WHERE f.userId = ?
      ORDER BY r.title
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [user]);
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

  async create(userId: string, recipeId: string) {
    await this.delete(userId, recipeId);
    const sql = `INSERT INTO favorite_recipes (userId, recipeId) VALUES (?, ?)`;
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql, [userId, recipeId]);
    return row;
  }

  async delete(userId: string, recipeId: string) {
    const sql =
      `DELETE FROM favorite_recipes WHERE userId = ? AND recipeId = ? LIMIT 1`;
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql, [userId, recipeId]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IFavoriteRecipe {
  pool: Pool;
  viewByUserId(userId: string): Data;
  //viewMost(): Data;
  create(userId: string, recipeId: string): Data;
  delete(userId: string, recipeId: string): Data;
}