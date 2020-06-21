import { Pool, RowDataPacket } from 'mysql2/promise';

export class FavoriteRecipe implements IFavoriteRecipe {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    //this.viewMostFavorited = this.viewMostFavorited.bind(this);
    this.deleteAllFavoritesOfRecipe =
      this.deleteAllFavoritesOfRecipe.bind(this);
    this.viewMyFavoriteRecipes = this.viewMyFavoriteRecipes.bind(this);
    this.createMyFavoriteRecipe = this.createMyFavoriteRecipe.bind(this);
    this.deleteMyFavoriteRecipe = this.deleteMyFavoriteRecipe.bind(this);
    this.deleteAllMyFavoriteRecipes =
      this.deleteAllMyFavoriteRecipes.bind(this);
  }

  /*async viewMostFavorited(limit) {
    //const sql = `
    //  SELECT recipe_id
    //  FROM nobsc_favorite_recipes
    //  ORDER BY COUNT(user_id) DESC
    //  LIMIT ?
    //`;
    const sql = `
      SELECT recipe_id, COUNT(recipe_id) AS tally
      FROM nobsc_favorite_recipes
      GROUP BY recipe_id
      ORDER BY tally DESC
      LIMIT ?
    `;
    const [ mostFavorited ] = this.pool.execute(sql, [limit]);
    return mostFavorited;
  }*/

  async deleteAllFavoritesOfRecipe(recipeId: number) {
    const sql = `
      DELETE
      FROM nobsc_favorite_recipes
      WHERE recipe_id = ?
    `;
    const [ unfavoritedRecipes ] = await this.pool
    .execute<RowDataPacket[]>(sql, [recipeId]);
    return unfavoritedRecipes;
  }

  async viewMyFavoriteRecipes(userId: number) {
    const sql = `
      SELECT 
        f.recipe_id AS recipe_id,
        r.title AS title,
        r.recipe_image AS recipe_image,
        r.owner_id AS owner_id,
        r.recipe_type_id AS recipe_type_id,
        r.cuisine_id AS cuisine_id
      FROM nobsc_favorite_recipes f
      INNER JOIN nobsc_recipes r ON r.recipe_id = f.recipe_id
      WHERE f.user_id = ?
      ORDER BY title
    `;
    const [ favoriteRecipes ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId]);
    return favoriteRecipes;
  }

  async createMyFavoriteRecipe(userId: number, recipeId: number) {
    await this.deleteMyFavoriteRecipe(userId, recipeId);
    const sql = `
      INSERT INTO nobsc_favorite_recipes (user_id, recipe_id)
      VALUES (?, ?)
    `;
    const [ favoritedRecipe ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId, recipeId]);
    return favoritedRecipe;
  }

  async deleteMyFavoriteRecipe(userId: number, recipeId: number) {
    const sql = `
      DELETE
      FROM nobsc_favorite_recipes
      WHERE user_id = ? AND recipe_id = ?
      LIMIT 1
    `;
    const [ unfavoritedRecipe ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId, recipeId]);
    return unfavoritedRecipe;
  }

  async deleteAllMyFavoriteRecipes(userId: number) {
    const sql = `
      DELETE
      FROM nobsc_favorite_recipes
      WHERE user_id = ?
    `;
    await this.pool.execute<RowDataPacket[]>(sql, [userId]);
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IFavoriteRecipe {
  pool: Pool;
  //viewMostFavorited(): Data;
  deleteAllFavoritesOfRecipe(recipeId: number): Data;
  viewMyFavoriteRecipes(userId: number): Data;
  createMyFavoriteRecipe(userId: number, recipeId: number): Data;
  deleteMyFavoriteRecipe(userId: number, recipeId: number): Data;
  deleteAllMyFavoriteRecipes(userId: number): void;
}