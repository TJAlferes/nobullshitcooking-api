class SavedRecipe {
  constructor(pool) {
    this.pool = pool;

    this.deleteAllSavesOfRecipe = this.deleteAllSavesOfRecipe.bind(this);

    this.viewMySavedRecipes = this.viewMySavedRecipes.bind(this);
    this.createMySavedRecipe = this.createMySavedRecipe.bind(this);
    this.deleteMySavedRecipe = this.deleteMySavedRecipe.bind(this);
  }

  async deleteAllSavesOfRecipe(recipeId) {
    const sql = `
      DELETE
      FROM nobsc_saved_recipes
      WHERE recipe_id = ?
    `;
    const [ unsavedRecipes ] = await this.pool.execute(sql, [recipeId]);
    return unsavedRecipes;
  }





  async viewMySavedRecipes(userId) {
    const sql = `
      SELECT 
        s.recipe_id AS recipe_id,
        r.title AS title,
        r.recipe_image AS recipe_image,
        r.owner_id AS owner_id
      FROM nobsc_saved_recipes s
      INNER JOIN nobsc_recipes r ON r.recipe_id = s.recipe_id
      WHERE user_id = ?
      ORDER BY title
    `;
    const [ savedRecipes ] = await this.pool.execute(sql, [userId]);
    return savedRecipes;
  }

  async createMySavedRecipe(userId, recipeId) {
    const sql = `
      INSERT INTO nobsc_saved_recipes (user_id, recipe_id)
      VALUES (?, ?)
    `;
    const [ savedRecipe ] = await this.pool.execute(sql, [userId, recipeId]);
    return savedRecipe;
  }

  async deleteMySavedRecipe(userId, recipeId) {
    const sql = `
      DELETE
      FROM nobsc_saved_recipes
      WHERE user_id = ? AND recipe_id = ?
      LIMIT 1
    `;
    const [ unsavedRecipe ] = await this.pool.execute(sql, [userId, recipeId]);
    return unsavedRecipe;
  }
}

module.exports = SavedRecipe;