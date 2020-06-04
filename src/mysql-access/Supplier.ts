import { Pool, RowDataPacket } from 'mysql2/promise';

export class Supplier implements ISupplier {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewAllSuppliers = this.viewAllSuppliers.bind(this);
    this.viewSupplierById = this.viewSupplierById.bind(this);
    this.createSupplier = this.createSupplier.bind(this);
    this.updateSupplier = this.updateSupplier.bind(this);
    this.deleteSupplier = this.deleteSupplier.bind(this);
  }

  async viewAllSuppliers() {
    const sql = `SELECT supplier_id, supplier_name FROM nobsc_suppliers`;
    const [ suppliers ] = await this.pool.execute<RowDataPacket[]>(sql);
    return suppliers;
  }

  async viewSupplierById(supplierId: number) {
    const sql = `
      SELECT supplier_id, supplier_name
      FROM nobsc_suppliers
      WHERE supplier_id = ?
    `;
    const [ supplier ] = await this.pool
    .execute<RowDataPacket[]>(sql, [supplierId]);
    return supplier;
  }

  async createSupplier(supplierName: string) {
    const sql = `
      INSERT INTO nobsc_suppliers (supplier_name)
      VALUES (?)
    `;
    const [ createdSupplier ] = await this.pool
    .execute<RowDataPacket[]>(sql, [supplierName]);
    return createdSupplier;
  }

  async updateSupplier(supplierId: number, supplierName: string) {
    const sql = `
      UPDATE nobsc_suppliers
      SET supplier_name = ?
      WHERE supplier_id = ?
      LIMIT 1
    `;
    const [ updatedSupplier ] = await this.pool.execute<RowDataPacket[]>(sql, [
      supplierName,
      supplierId
    ]);
    return updatedSupplier;
  }

  async deleteSupplier(supplierId: number) {
    const sql = `
      DELETE
      FROM nobsc_suppliers
      WHERE supplier_id = ?
      LIMIT 1
    `;
    const [ deletedSupplier ] = await this.pool
    .execute<RowDataPacket[]>(sql, [supplierId]);
    return deletedSupplier;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ISupplier {
  viewAllSuppliers(): Data;
  viewSupplierById(supplierId: number): Data;
  createSupplier(supplierName: string): Data;
  updateSupplier(supplierId: number, supplierName: string): Data;
  deleteSupplier(supplierId: number): Data;
}