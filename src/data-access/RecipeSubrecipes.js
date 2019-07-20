class RecipeSubrecipes {
  constructor(pool) {
    this.pool = pool;
    this.viewRecipeSubrecipesByRecipeId = this.viewRecipeSubrecipesByRecipeId.bind(this);
    this.viewRecipeSubrecipesForEditFormByRecipeId = this.viewRecipeSubrecipesForEditFormByRecipeId.bind(this);
    this.createRecipeSubrecipes = this.createRecipeSubrecipes.bind(this);
    this.updateRecipeSubrecipes = this.updateRecipeSubrecipes.bind(this);
    this.deleteRecipeSubrecipes = this.deleteRecipeSubrecipes.bind(this);
  }

  async viewRecipeSubrecipesByRecipeId(recipeId) {
    const sql = `
      SELECT rs.amount, m.measurement_name, r.title
      FROM nobsc_recipe_subrecipes rs
      INNER JOIN nobsc_measurements m ON m.measurement_id = rs.measurement_id
      INNER JOIN nobsc_recipes r ON r.recipe_id = rs.subrecipe_id
      WHERE rs.recipe_id = ?
      ORDER BY r.recipe_type_id
    `;
    const [ recipeSubrecipes ] = await this.pool.execute(sql, [recipeId]);
    return recipeSubrecipes;
  }

  async viewRecipeSubrecipesForEditFormByRecipeId(recipeId) {
    const sql = `
      SELECT amount, measurement_id, subrecipe_id
      FROM nobsc_recipe_subrecipes
      WHERE recipe_id = ?
    `;
    const [ recipeSubrecipes ] = await this.pool.execute(sql, [recipeId]);
    return recipeSubrecipes;
  }

  async createRecipeSubrecipes(recipeSubrecipes, recipeSubrecipesPlaceholders, generatedId) {
    const sql = `
      INSERT INTO nobsc_recipe_subrecipes (recipe_id, subrecipe_id, amount, measurement_id)
      VALUES ${recipeSubrecipesPlaceholders}
    `;
    let recipeSubrecipesParams = [];
    recipeSubrecipes.map(rS => {
      recipeSubrecipesParams.push(generatedId, rS.recipeId, rS.amount, rS.measurementId);
    });
    const [ createdRecipeSubrecipes ] = await this.pool.execute(sql, recipeSubrecipesParams);
    return createdRecipeSubrecipes;
  }

  async updateRecipeSubrecipes() {}

  async deleteRecipeSubrecipes() {}
}

module.exports = RecipeSubrecipes;