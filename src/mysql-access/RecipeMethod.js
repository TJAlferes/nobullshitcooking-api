class RecipeMethod {
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

  async createRecipeMethods(recipeMethods, recipeMethodsPlaceholders) {
    const sql = `
      INSERT INTO nobsc_recipe_methods (recipe_id, method_id)
      VALUES ${recipeMethodsPlaceholders} 
    `;
    const [ createdRecipeMethods ] = await this.pool.execute(sql, recipeMethods);
    return createdRecipeMethods;
  }

  async updateRecipeMethods(recipeMethods, recipeMethodsPlaceholders, recipeId) {
    const sql1 = `
      DELETE
      FROM nobsc_recipe_methods
      WHERE recipe_id = ?
    `;
    const sql2 = (recipeMethods !== "none")
    ? `
      INSERT INTO nobsc_recipe_methods (recipe_id, method_id)
      VALUES ${recipeMethodsPlaceholders} 
    `
    : "none";
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();
    try {
      await connection.query(sql1, [recipeId]);
      if (sql2 !== "none") const [ updatedRecipeMethods ] = await connection.query(sql2, [recipeMethods]);
      await connection.commit();
      if (sql2 !== "none") return updatedRecipeMethods;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async deleteRecipeMethods(recipeId) {
    const sql = `
      DELETE
      FROM nobsc_recipe_methods
      WHERE recipe_id = ?
    `;
    const [ deletedRecipeMethods ] = await this.pool.execute(sql, [recipeId]);
    return deletedRecipeMethods;
  }
}

module.exports = RecipeMethod;