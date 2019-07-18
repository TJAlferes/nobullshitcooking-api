class RecipeIngredients {
  constructor(pool) {
    this.pool = pool;
    this.viewRecipeIngredientsByRecipeId = this.viewRecipeIngredientsByRecipeId.bind(this);
    this.viewRecipeIngredientsForEditFormByRecipeId = this.viewRecipeIngredientsForEditFormByRecipeId.bind(this);
    this.createRecipeIngredients = this.createRecipeIngredients.bind(this);
    this.updateRecipeIngredients = this.updateRecipeIngredients.bind(this);
    this.deleteRecipeIngredients = this.deleteRecipeIngredients.bind(this);
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

  async viewRecipeIngredientsForEditFormByRecipeId(recipeId) {
    const sql = `
      SELECT amount, measurement_id, ingredient_id
      FROM nobsc_recipe_ingredients
      WHERE recipe_id = ?
    `;
    const [ recipeIngredients ] = await this.pool.execute(sql, [recipeId]);
    return recipeIngredients;
  }

  async createRecipeIngredients(recipeIngredients, recipeIngredientsPlaceholders, generatedId) {
    const sql = `
      INSERT INTO nobsc_recipe_ingredients (recipe_id, ingredient_id, amount, measurement_id)
      VALUES ${recipeIngredientsPlaceholders}
    `;
    let recipeIngredientsParams = [];
    recipeIngredients.map(rI => {
      recipeIngredientsParams.push(generatedId, rI.ingredientId, rI.amount, rI.measurementId);
    });
    const [ createdRecipeIngredients ] = await this.pool.execute(sql, recipeIngredientsParams);
  }


}

module.exports = RecipeIngredients;