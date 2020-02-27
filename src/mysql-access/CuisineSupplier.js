class CuisineSupplier {
  constructor(pool) {
    this.pool = pool;
    this.viewCuisineSuppliersByCuisineId = this.viewCuisineSuppliersByCuisineId.bind(this);
    this.createCuisineSupplier = this.createCuisineSupplier.bind(this);
    this.deleteCuisineSupplier = this.deleteCuisineSupplier.bind(this);
    this.deleteCuisineSuppliersBySupplierId = this.deleteCuisineSuppliersBySupplierId.bind(this);
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

  // used when deleting a cuisine-supplier relationship
  async deleteCuisineSupplier(cuisineId, supplierId) {
    const sql = `
      DELETE
      FROM nobsc_cuisine_suppliers
      WHERE cuisineId = ? AND supplier_id = ?
    `;
    
    const [ deletedCuisineSupplier ] = await this.pool.execute(sql, [
      cuisineId,
      supplierId
    ]);

    return deletedCuisineSupplier;
  }

  // used when deleting a supplier
  async deleteCuisineSuppliersBySupplierId(supplierId) {
    const sql = `
      DELETE
      FROM nobsc_cuisine_suppliers
      WHERE supplier_id = ?
    `;
    
    const [ deletedCuisineSuppliers ] = await this.pool
    .execute(sql, [supplierId]);

    return deletedCuisineSuppliers;
  }
}

module.exports = CuisineSupplier;