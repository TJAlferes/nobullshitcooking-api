import { Pool, RowDataPacket } from 'mysql2/promise';

export class SavedRecipe implements ISavedRecipe {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByUserId = this.viewByUserId.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  async viewByUserId(userId: string) {
    const sql = `
      SELECT 
        r.id,
        r.title,
        r.recipe_image,
        r.ownerId,
        r.type,
        r.cuisine
      FROM saved_recipes s
      INNER JOIN recipes r ON r.id = s.recipeId
      WHERE s.userId = ?
      ORDER BY r.title
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [userId]);
    return rows;
  }

  async create(userId: string, recipeId: string) {
    await this.delete(userId, recipeId);
    const sql = `INSERT INTO saved_recipes (userId, recipeId) VALUES (?, ?)`;
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql, [userId, recipeId]);
    return row;
  }

  async delete(userId: string, recipeId: string) {
    const sql =
      `DELETE FROM saved_recipes WHERE userId = ? AND recipeId = ? LIMIT 1`;
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql, [userId, recipeId]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ISavedRecipe {
  pool: Pool;
  viewByUserId(userId: string): Data;
  create(userId: string, recipeId: string): Data;
  delete(userId: string, recipeId: string): Data;
}