class RecipeIngredient {
  constructor(pool) {
    this.pool = pool;
    this.viewRecipeIngredientsByRecipeId = this.viewRecipeIngredientsByRecipeId.bind(this);
    this.createRecipeIngredients = this.createRecipeIngredients.bind(this);
    this.updateRecipeIngredients = this.updateRecipeIngredients.bind(this);
    this.deleteRecipeIngredients = this.deleteRecipeIngredients.bind(this);
    this.deleteRecipeIngredientsByIngredientId = this.deleteRecipeIngredientsByIngredientId.bind(this);
  }

  async viewRecipeIngredientsByRecipeId(recipeId) {
    const sql = `
      SELECT ri.amount, m.measurement_name, i.ingredient_name
      FROM nobsc_recipe_ingredients ri
      INNER JOIN nobsc_measurements m ON m.measurement_id = ri.measurement_id
      INNER JOIN nobsc_ingredients i ON i.ingredient_id = ri.ingredient_id
      WHERE ri.recipe_id = ?
      ORDER BY i.ingredient_type_id
    `;
    const [ recipeIngredients ] = await this.pool.execute(sql, [recipeId]);
    return recipeIngredients;
  }

  async createRecipeIngredients(recipeIngredients, recipeIngredientsPlaceholders) {
    const sql = `
      INSERT INTO nobsc_recipe_ingredients (recipe_id, ingredient_id, amount, measurement_id)
      VALUES ${recipeIngredientsPlaceholders}
    `;
    const [ createdRecipeIngredients ] = await this.pool.execute(sql, recipeIngredients);
    return createdRecipeIngredients;
  }

  async updateRecipeIngredients(recipeIngredients, recipeIngredientsPlaceholders, recipeId) {
    const sql1 = `
      DELETE
      FROM nobsc_recipe_ingredients
      WHERE recipe_id = ?
    `;
    const sql2 = (recipeIngredients !== "none")
    ? `
      INSERT INTO nobsc_recipe_ingredients (recipe_id, ingredient_id, amount, measurement_id)
      VALUES ${recipeIngredientsPlaceholders} 
    `
    : "none";
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();
    try {
      await connection.query(sql1, [recipeId]);
      if (sql2 !== "none") {
        const [ updatedRecipeIngredients ] = await connection.query(sql2, [recipeIngredients]);
        await connection.commit();
        return updatedRecipeIngredients;
      } else {
        await connection.commit();
      }
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async deleteRecipeIngredients(recipeId) {
    const sql = `
      DELETE
      FROM nobsc_recipe_ingredients
      WHERE recipe_id = ?
    `;
    const [ deletedRecipeIngredients ] = await this.pool.execute(sql, [recipeId]);
    return deletedRecipeIngredients;
  }

  async deleteRecipeIngredientsByIngredientId(ingredientId) {
    const sql = `
      DELETE
      FROM nobsc_recipe_ingredients
      WHERE ingredient_id = ?
    `;
    const [ deletedRecipeIngredients ] = await this.pool.execute(sql, [ingredientId]);
    return deletedRecipeIngredients;
  }
}

module.exports = RecipeIngredient;