import { Pool, RowDataPacket } from 'mysql2/promise';

export class SavedRecipe implements ISavedRecipe {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.deleteAllSavesOfRecipe = this.deleteAllSavesOfRecipe.bind(this);
    this.viewMySavedRecipes = this.viewMySavedRecipes.bind(this);
    this.createMySavedRecipe = this.createMySavedRecipe.bind(this);
    this.deleteMySavedRecipe = this.deleteMySavedRecipe.bind(this);
    this.deleteAllMySavedRecipes = this.deleteAllMySavedRecipes.bind(this);
  }

  async deleteAllSavesOfRecipe(recipeId: number) {
    const sql = `
      DELETE
      FROM nobsc_saved_recipes
      WHERE recipe_id = ?
    `;
    const [ unsavedRecipes ] = await this.pool
    .execute<RowDataPacket[]>(sql, [recipeId]);
    return unsavedRecipes;
  }

  async viewMySavedRecipes(userId: number) {
    const sql = `
      SELECT 
        s.recipe_id,
        r.title,
        r.recipe_image,
        r.owner_id,
        r.recipe_type_id,
        r.cuisine_id
      FROM nobsc_saved_recipes s
      INNER JOIN nobsc_recipes r ON r.recipe_id = s.recipe_id
      WHERE user_id = ?
      ORDER BY title
    `;
    const [ savedRecipes ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId]);
    return savedRecipes;
  }

  async createMySavedRecipe(userId: number, recipeId: number) {
    await this.deleteMySavedRecipe(userId, recipeId);
    const sql = `
      INSERT INTO nobsc_saved_recipes (user_id, recipe_id)
      VALUES (?, ?)
    `;
    const [ savedRecipe ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId, recipeId]);
    return savedRecipe;
  }

  async deleteMySavedRecipe(userId: number, recipeId: number) {
    const sql = `
      DELETE
      FROM nobsc_saved_recipes
      WHERE user_id = ? AND recipe_id = ?
      LIMIT 1
    `;
    const [ unsavedRecipe ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId, recipeId]);
    return unsavedRecipe;
  }

  async deleteAllMySavedRecipes(userId: number) {
    const sql = `
      DELETE
      FROM nobsc_saved_recipes
      WHERE user_id = ?
    `;
    await this.pool.execute<RowDataPacket[]>(sql, [userId]);
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ISavedRecipe {
  pool: Pool;
  deleteAllSavesOfRecipe(recipeId: number): Data;
  viewMySavedRecipes(userId: number): Data;
  createMySavedRecipe(userId: number, recipeId: number): Data;
  deleteMySavedRecipe(userId: number, recipeId: number): Data;
  deleteAllMySavedRecipes(userId: number): void;
}