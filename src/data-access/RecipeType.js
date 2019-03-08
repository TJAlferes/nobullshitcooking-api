class RecipeType {
  constructor(pool) {
    //super(props);
    this.pool = pool;  // .bind(this)?
  }

  viewRecipeTypes() {
    const sql = `
      SELECT recipe_type_id, recipe_type_name
      FROM nobsc_recipe_types
    `;
    return pool.execute(sql);
  }

  viewRecipeType(typeId) {
    const sql = `
      SELECT recipe_type_id, recipe_type_name
      FROM nobsc_recipe_types
      WHERE recipe_type_id = ?
    `;
    return pool.execute(sql, [typeId]);
  }
}

module.exports = RecipeType;