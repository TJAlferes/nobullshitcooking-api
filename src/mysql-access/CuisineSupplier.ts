import { Pool, RowDataPacket } from 'mysql2/promise';

export class CuisineSupplier implements ICuisineSupplier {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByCuisineId = this.viewByCuisineId.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteBySupplierId = this.deleteBySupplierId.bind(this);
  }

  async viewByCuisineId(cuisineId: number) {
    const sql = `
      SELECT s.name AS supplier_name
      FROM cuisine_suppliers cs
      INNER JOIN suppliers s ON s.id = cs.supplier_id
      WHERE cs.cuisine_id = ?
      ORDER BY s.name ASC
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [cuisineId]);
    return rows;
  }

  async create(cuisineId: number, supplierId: number) {
    // to prevent duplicates?
    await this.delete(cuisineId, supplierId);  // ?
    const sql = `
      INSERT INTO cuisine_suppliers (cuisine_id, supplier_id) VALUES (?, ?)
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [cuisineId, supplierId]);
    return row;
  }

  // used when deleting a cuisine-supplier relationship
  async delete(cuisineId: number, supplierId: number) {
    const sql = `
      DELETE FROM cuisine_suppliers WHERE cuisineId = ? AND supplier_id = ?
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [cuisineId, supplierId]);
    return row;
  }

  // used when deleting a supplier
  async deleteBySupplierId(supplierId: number) {
    const sql = `DELETE FROM cuisine_suppliers WHERE supplier_id = ?`;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, [supplierId]);
    return rows;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ICuisineSupplier {
  pool: Pool;
  viewByCuisineId(cuisineId: number): Data;
  create(cuisineId: number, supplierId: number): Data;
  delete(cuisineId: number, supplierId: number): Data;
  deleteBySupplierId(supplierId: number): Data;
}