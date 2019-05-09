class IngredientType {
  constructor(pool) {
    this.pool = pool;
    this.viewAllIngredientTypes = this.viewAllIngredientTypes.bind(this);
    this.viewIngredientTypeById = this.viewIngredientTypeById.bind(this);
  }

  async viewAllIngredientTypes() {
    const sql = `
      SELECT ingredient_type_id, ingredient_type_name
      FROM nobsc_ingredient_types
    `;
    const [ allIngredientTypes ] = await this.pool.execute(sql);
    return allIngredientTypes;
  }

  async viewIngredientTypeById(typeId) {
    const sql = `
      SELECT ingredient_type_id, ingredient_type_name
      FROM nobsc_ingredient_types
      WHERE ingredient_type_id = ?
    `;
    const [ ingredientType] = await this.pool.execute(sql, [typeId]);
    return ingredientType;
  }
}

module.exports = IngredientType;