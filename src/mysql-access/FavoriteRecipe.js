class FavoriteRecipe {
  constructor(pool) {
    this.pool = pool;
    this.viewMostFavorited = this.viewMostFavorited.bind(this);
    this.viewFavoritedRecipes = this.viewFavoritedRecipes.bind(this);
    this.createFavoriteRecipe = this.createFavoriteRecipe.bind(this);
    this.deleteFavoriteRecipe = this.deleteFavoriteRecipe.bind(this);
  }

  async viewMostFavorited(limit) {
    /*const sql = `
      SELECT recipe_id
      FROM nobsc_favorite_recipes
      ORDER BY COUNT(user_id) DESC
      LIMIT ?
    `;*/
    const sql = `
      SELECT recipe_id, COUNT(recipe_id) AS tally
      FROM nobsc_favorite_recipes
      GROUP BY recipe_id
      ORDER BY tally DESC
      LIMIT ?
    `;
    const [ mostFavorited ] = this.pool.execute(sql, [limit]);
    return mostFavorited;
  }

  async viewFavoriteRecipes(userId) {
    const sql = `
      SELECT 
        f.recipe_id AS recipe_id,
        r.title AS title,
        r.recipe_image AS recipe_image
      FROM nobsc_favorite_recipes f
      INNER JOIN nobsc_recipes r ON f.recipe_id = r.recipe_id
      WHERE user_id = ? AND 
      ORDER BY title
    `;
    const [ favoriteRecipes ] = this.pool.execute(sql, [userId]);
    return favoriteRecipes;
  }

  async createFavoriteRecipe(userId, recipeId) {
    const sql = `
      INSERT INTO nobsc_favorite_recipes (user_id, recipe_id)
      VALUES (?, ?)
    `;
    const [ favoritedRecipe ] = this.pool.execute(sql, [userId, recipeId]);
    return favoritedRecipe;
  }

  async deleteFavoriteRecipe(userId, recipeId) {
    const sql = `
      DELETE
      FROM nobsc_favorite_recipes
      WHERE user_id = ? AND recipe_id = ?
      LIMIT 1
    `;
    const [ unfavoritedRecipe ] = this.pool.execute(sql, [userId, recipeId]);
    return unfavoritedRecipe;
  }
}

module.exports = FavoriteRecipe;