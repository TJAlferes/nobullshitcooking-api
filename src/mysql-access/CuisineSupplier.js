class CuisineSupplier {
  constructor(pool) {
    this.pool = pool;
    this.viewCuisineSuppliersByCuisineId = this.viewCuisineSuppliersByCuisineId.bind(this);
    this.createCuisineSupplier = this.createCuisineSupplier.bind(this);
    this.updateCuisineSupplier = this.updateCuisineSupplier.bind(this);
    this.deleteCuisineSupplier = this.deleteCuisineSupplier.bind(this);
  }

  async viewCuisineSuppliersByCuisineId(cuisineId) {
    const sql = `
      SELECT s.supplier_name
      FROM nobsc_cuisine_suppliers cs
      INNER JOIN nobsc_suppliers s ON s.supplier_id = cs.supplier_id
      WHERE cs.cuisine_id = ?
      ORDER BY s.supplier_name ASC
    `;

    const [ cuisineSuppliers ] = await this.pool.execute(sql, [cuisineId]);

    return cuisineSuppliers;
  }

  async createCuisineSupplier(cuisineId, supplierId) {
    const sql = `
      INSERT INTO nobsc_cuisine_suppliers (cuisine_id, supplier_id)
      VALUES (?, ?)
    `;

    const [ createdCuisineSupplier ] = await this.pool.execute(sql, [
      cuisineId,
      supplierId
    ]);

    return createdCuisineSupplier;
  }

  async updateCuisineSupplier() {
    const sql = `
    
    `;
    
  }

  async deleteCuisineSupplier() {
    const sql = `
    
    `;
    
  }
}

module.exports = CuisineSupplier;