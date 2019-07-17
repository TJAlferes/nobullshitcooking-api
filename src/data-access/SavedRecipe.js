class SavedRecipe {
  constructor(pool) {
    this.pool = pool;
    this.viewSavedByUser = this.viewSavedByUser.bind(this);
    this.createSavedByUser = this.createSavedByUser.bind(this);
    this.deleteSavedByUser = this.deleteSavedByUser.bind(this);
  }

  async viewSavedByUser(userId) {
    const sql = `
      SELECT 
        s.recipe_id AS recipe_id,
        r.title AS title,
        r.recipe_image AS recipe_image
      FROM nobsc_saved_recipes s
      INNER JOIN nobsc_recipes r ON f.recipe_id = r.recipe_id
      WHERE user_id = ?
      ORDER BY title
    `;  // make a react router link to this recipe page, use tiny image folder from s3
    const [ saved ] = this.pool.execute(sql, [userId]);
    return saved;
  }

  async createSavedByUser(userId, recipeId) {
    const sql = `
      INSERT INTO nobsc_saved_recipes (user_id, recipe_id)
      VALUES (?, ?)
    `;
    const [ saved ] = this.pool.execute(sql, [userId, recipeId]);
    return saved;
  }

  async deleteSavedByUser(userId, recipeId) {
    const sql = `
      DELETE
      FROM nobsc_saved_recipes
      WHERE user_id = ? AND recipe_id = ?
      LIMIT 1
    `;
    const [ saved ] = this.pool.execute(sql, [userId, recipeId]);
    return saved;
  }
}

module.exports = SavedRecipe;