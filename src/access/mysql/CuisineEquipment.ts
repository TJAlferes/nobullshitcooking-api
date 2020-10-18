import { Pool, RowDataPacket } from 'mysql2/promise';

export class CuisineEquipment implements ICuisineEquipment {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByCuisine = this.viewByCuisine.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  // double check
  async viewByCuisine(cuisine: string) {
    const sql = `
      SELECT ce.equipment
      FROM cuisine_equipment ce
      INNER JOIN equipment e ON e.id = ce.equipment
      WHERE ce.cuisine = ?
      GROUP BY e.equipment_type
      ORDER BY e.name ASC
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [cuisine]);
    return rows;
  }

  async create(cuisine: string, equipment: string) {
    const sql = `
      INSERT INTO cuisine_equipment (cuisine, equipment) VALUES (?, ?)
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [cuisine, equipment]);
    return row;
  }

  async delete(cuisine: string, equipment: string) {
    const sql = `
      DELETE FROM cuisine_equipment WHERE cuisine = ? AND equipment = ?
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [cuisine, equipment]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ICuisineEquipment {
  pool: Pool;
  viewByCuisine(cuisine: string): Data;
  create(cuisine: string, equipment: string): Data;
  delete(cuisine: string, equipment: string): Data;
}