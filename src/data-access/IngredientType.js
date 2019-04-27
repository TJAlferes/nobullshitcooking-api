class IngredientType {
  constructor(pool) {
    this.pool = pool;
    this.viewAllIngredientTypes = this.viewAllIngredientTypes.bind(this);
    this.viewIngredientTypeById = this.viewIngredientTypeById.bind(this);
  }

  viewAllIngredientTypes() {
    const sql = `
      SELECT ingredient_type_id, ingredient_type_name
      FROM nobsc_ingredient_types
    `;
    return this.pool.execute(sql);
  }

  viewIngredientTypeById(typeId) {
    const sql = `
      SELECT ingredient_type_id, ingredient_type_name
      FROM nobsc_ingredient_types
      WHERE ingredient_type_id = ?
    `;
    return this.pool.execute(sql, [typeId]);
  }
}

module.exports = IngredientType;