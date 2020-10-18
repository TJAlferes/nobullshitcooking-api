import { Pool, RowDataPacket } from 'mysql2/promise';

export class CuisineSupplier implements ICuisineSupplier {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByCuisine = this.viewByCuisine.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteBySupplier = this.deleteBySupplier.bind(this);
  }

  async viewByCuisine(cuisine: string) {
    const sql = `
      SELECT supplier
      FROM cuisine_suppliers
      WHERE cs.cuisine = ?
      ORDER BY supplier ASC
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [cuisine]);
    return rows;
  }

  async create(cuisine: string, supplier: string) {
    // to prevent duplicates?
    await this.delete(cuisine, supplier);  // ?
    const sql = `
      INSERT INTO cuisine_suppliers (cuisine, supplier) VALUES (?, ?)
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [cuisine, supplier]);
    return row;
  }

  // used when deleting a cuisine-supplier relationship
  async delete(cuisine: string, supplier: string) {
    const sql = `
      DELETE FROM cuisine_suppliers WHERE cuisine = ? AND supplier = ?
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [cuisine, supplier]);
    return row;
  }

  // used when deleting a supplier
  async deleteBySupplier(supplier: string) {
    const sql = `DELETE FROM cuisine_suppliers WHERE supplier = ?`;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, [supplier]);
    return rows;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ICuisineSupplier {
  pool: Pool;
  viewByCuisine(cuisine: string): Data;
  create(cuisine: string, supplier: string): Data;
  delete(cuisine: string, supplier: string): Data;
  deleteBySupplier(supplier: string): Data;
}