class RecipeType {
  constructor(pool) {
    this.pool = pool;
    this.viewAllRecipeTypes = this.viewAllRecipeTypes.bind(this);
    this.viewRecipeTypeById = this.viewRecipeTypeById.bind(this);
  }

  viewAllRecipeTypes() {
    const sql = `
      SELECT recipe_type_id, recipe_type_name
      FROM nobsc_recipe_types
    `;
    return pool.execute(sql);
  }

  viewRecipeTypeById(typeId) {
    const sql = `
      SELECT recipe_type_id, recipe_type_name
      FROM nobsc_recipe_types
      WHERE recipe_type_id = ?
    `;
    return pool.execute(sql, [typeId]);
  }
}

module.exports = RecipeType;