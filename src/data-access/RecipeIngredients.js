class RecipeIngredients {
  constructor(pool) {
    this.pool = pool;
    this.viewRecipeIngredientsByRecipeId = this.viewRecipeIngredientsByRecipeId.bind(this);
    this.createRecipeIngredients = this.createRecipeIngredients.bind(this);
    this.updateRecipeIngredients = this.updateRecipeIngredients.bind(this);
    this.deleteRecipeIngredients = this.deleteRecipeIngredients.bind(this);
  }

  async viewRecipeIngredientsByRecipeId(recipeId) {
    const sql = `
      SELECT re.amount e.ingredient_name
      FROM nobsc_recipe_ingredients ri
      INNER JOIN nobsc_ingredients i ON e.ingredient_id = re.ingredient_id
      INNER JOIN nobsc_ingredient_types it ON e.ingredient_type_id = et.ingredient_type_id
      WHERE re.recipe_id = ?
      ORDER BY ingredient_type_id
    `;
    const [ recipeIngredients ] = await this.pool.execute(sql, [recipeId]);
  }
}

module.exports = RecipeIngredients;