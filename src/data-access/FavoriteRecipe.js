class FavoriteRecipe {
  constructor(pool) {
    this.pool = pool;
    this.viewMostFavorited = this.viewMostFavorited.bind(this);
    this.viewFavoritedByUser = this.viewFavoritedByUser.bind(this);
    this.createFavoritedByUser = this.createFavoritedByUser.bind(this);
    this.deleteFavoritedByUser = this.deleteFavoritedByUser.bind(this);
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
    console.log(mostFavorited);
    return mostFavorited;
  }

  async viewFavoritedByUser(userId) {
    const sql = `
      SELECT 
        f.recipe_id AS recipe_id,
        r.title AS title,
        r.recipe_image AS recipe_image
      FROM nobsc_favorite_recipes f
      INNER JOIN nobsc_recipes r ON f.recipe_id = r.recipe_id
      WHERE user_id = ?
      ORDER BY title
    `;  // make a react router link to this recipe page, use tiny image folder from s3
    const [ favorites ] = this.pool.execute(sql, [userId]);
    console.log(favorites);
    return favorites;
  }

  async createFavoritedByUser(userId, recipeId) {
    const sql = `
      INSERT INTO nobsc_favorite_recipes (user_id, recipe_id)
      VALUES (?, ?)
    `;
    const [ favorited ] = this.pool.execute(sql, [userId, recipeId]);
    return favorited;
  }

  async deleteFavoritedByUser(userId, recipeId) {
    const sql = `
      DELETE
      FROM nobsc_favorite_recipes
      WHERE user_id = ? AND recipe_id = ?
      LIMIT 1
    `;
    const [ unfavorited ] = this.pool.execute(sql, [userId, recipeId]);
    return unfavorited;
  }
}

module.exports = FavoriteRecipe;