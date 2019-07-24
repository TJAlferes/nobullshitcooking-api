class Cuisine {
  constructor(pool) {
    this.pool = pool;
    this.viewAllCuisines = this.viewAllCuisines.bind(this);
    this.viewCuisineById = this.viewCuisineById.bind(this);
  }

  async viewAllCuisines() {
    const sql = `
      SELECT cuisine_id, cuisine_name
      FROM nobsc_cuisines
    `;
    const [ allCuisines ] = await this.pool.execute(sql);
    return allCuisines;
  }

  async viewCuisineById(cuisineId) {
    const sql = `
      SELECT cuisine_id, cuisine_name
      FROM nobsc_cuisines
      WHERE cuisine_id = ?
    `;
    const [ cuisine ] = await this.pool.execute(sql, [cuisineId]);
    return cuisine;
  }
}

module.exports = Cuisine;