class RecipeMethods {
  constructor(pool) {
    this.pool = pool;
    this.viewRecipeMethodsByRecipeId = this.viewRecipeMethodsByRecipeId.bind(this);
    this.viewRecipeMethodsForEditFormByRecipeId = this.viewRecipeMethodsForEditFormByRecipeId.bind(this);
    this.createRecipeMethods = this.createRecipeMethods.bind(this);
    this.updateRecipeMethods = this.updateRecipeMethods.bind(this);
    this.deleteRecipeMethods = this.deleteRecipeMethods.bind(this);
  }

  async viewRecipeMethodsByRecipeId(recipeId) {
    const sql = `
      SELECT m.method_name
      FROM nobsc_recipe_methods rm
      INNER JOIN nobsc_methods m ON m.method_id = rm.method_id
      WHERE rm.recipe_id = ?
      ORDER BY m.method_id
    `;
    const [ recipeMethods ] = await this.pool.execute(sql, [recipeId]);
    return recipeMethods;
  }

  async viewRecipeMethodsForEditFormByRecipeId(recipeId) {
    const sql = `
      SELECT method_id
      FROM nobsc_recipe_methods
      WHERE recipe_id = ?
    `;
    const [ recipeMethods ] = await this.pool.execute(sql, [recipeId]);
    return recipeMethods;
  }

  async createRecipeMethods(recipeMethods, recipeMethodsPlaceholders, generatedId) {
    const sql = `
      INSERT INTO nobsc_recipe_methods (recipe_id, method_id)
      VALUES ${recipeMethodsPlaceholders} 
    `;
    let recipeMethodsParams = [];
    recipeMethods.map(rM => {
      recipeMethodsParams.push(generatedId, rM.methodId);
    });
    const [ createdRecipeMethods ] = await this.pool.execute(sql, recipeMethodsParams);
    return createdRecipeMethods;
  }

  async updateRecipeMethods() {
    const sql = `
      UPDATE nobsc_recipe_methods
      SET method_id = ?
      WHERE recipe_id = ?
      LIMIT 1;
    `;

  }

  async deleteRecipeMethods() {
    const sql = `
      DELETE
      FROM nobsc_recipe_equipment
      where recipe_id = ? AND equipment
    `;

  }
}

module.exports = RecipeMethods;