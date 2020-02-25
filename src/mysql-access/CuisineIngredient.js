class CuisineIngredient {
  constructor(pool) {
    this.pool = pool;
    this.viewCuisineIngredientsByCuisineId = this.viewCuisineIngredientsByCuisineId.bind(this);
    this.createCuisineIngredient = this.createCuisineIngredient.bind(this);
    this.updateCuisineIngredient = this.updateCuisineIngredient.bind(this);
    this.deleteCuisineIngredient = this.deleteCuisineIngredient.bind(this);
  }

  async viewCuisineIngredientsByCuisineId(cuisineId) {
    const sql = `
      SELECT i.ingredient_id, i.ingredient_name
      FROM nobsc_cuisine_ingredients ci
      INNER JOIN nobsc_ingredients i ON i.ingredient_id = ci.ingredient_id
      WHERE ci.cuisine_id = ?
      GROUP BY i.ingredient_type_id
      ORDER BY i.ingredient_name ASC
    `;

    const [ cuisineEquipment ] = await this.pool.execute(sql, [cuisineId]);

    return cuisineEquipment;
  }

  async createCuisineIngredient() {
    const sql = `
    
    `;
    
  }

  async updateCuisineIngredient() {
    const sql = `
    
    `;
    
  }

  async deleteCuisineIngredient() {
    const sql = `
    
    `;
    
  }
}

module.exports = CuisineIngredient;