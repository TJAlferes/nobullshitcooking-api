class Supplier {
  constructor(pool) {
    this.pool = pool;
    this.viewAllSuppliers = this.viewAllSuppliers.bind(this);
    this.viewSupplierById = this.viewSupplierById.bind(this);
    this.createSupplier = this.createSupplier.bind(this);
    this.updateSupplier = this.updateSupplier.bind(this);
    this.deleteSupplier = this.deleteSupplier.bind(this);
  }

  async viewAllSuppliers() {
    const sql = `SELECT supplier_id, supplier_name FROM nobsc_suppliers`;
    const [ suppliers ] = await this.pool.execute(sql);
    return suppliers;
  }

  async viewSupplierById(supplierId) {
    const sql = `
      SELECT supplier_id, supplier_name
      FROM nobsc_suppliers
      WHERE supplier_id = ?
    `;
    const [ supplier ] = await this.pool.execute(sql, [supplierId]);
    return supplier;
  }

  async createSupplier(supplierName) {
    const sql = `
      INSERT INTO nobsc_suppliers (supplier_name)
      VALUES (?)
    `;
    const [ createdPlan ] = await this.pool.execute(sql, [supplierName]);
    return createdPlan;
  }

  async updateSupplier(supplierToUpdateWith, supplierId) {
    const { supplierName } = supplierToUpdateWith;
    const sql = `
      UPDATE nobsc_suppliers
      SET supplier_name = ?
      WHERE supplier_id = ?
      LIMIT 1
    `;
    const [ updatedSupplier ] = await this.pool.execute(sql, [
      supplierName,
      supplierId
    ]);
    return updatedSupplier;
  }

  async deleteSupplier(supplierId) {
    const sql = `
      DELETE
      FROM nobsc_suppliers
      WHERE supplier_id = ?
      LIMIT 1
    `;
    const [ deletedSupplier ] = await this.pool.execute(sql, [supplierId]);
    return deletedSupplier;
  }
}

module.exports = Supplier;