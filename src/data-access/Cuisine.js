class Cuisine {
  constructor(pool) {
    this.pool = pool;
    this.viewAllCuisines = this.viewAllCuisines.bind(this);
    this.viewCuisineById = this.viewCuisineById.bind(this);
  }

  async viewAllCuisines() {
    const sql = `
      SELECT ingredient_type_id, ingredient_type_name
      FROM nobsc_ingredient_types
    `;
    const [ allCuisines ] = await this.pool.execute(sql);
    return allCuisines;
  }

  async viewCuisineById(cuisineId) {
    const sql = `
      SELECT ingredient_type_id, ingredient_type_name
      FROM nobsc_ingredient_types
      WHERE ingredient_type_id = ?
    `;
    const [ cuisine ] = await this.pool.execute(sql, [cuisineId]);
    return cuisine;
  }
}

module.exports = Cuisine;