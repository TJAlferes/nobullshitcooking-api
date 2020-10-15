import { Pool, RowDataPacket } from 'mysql2/promise';

export class CuisineEquipment implements ICuisineEquipment {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByCuisineId = this.viewByCuisineId.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  async viewByCuisineId(cuisineId: number) {
    const sql = `
      SELECT ce.equipment_id, e.name AS equipment_name
      FROM cuisine_equipment ce
      INNER JOIN equipment e ON e.id = ce.equipment_id
      WHERE ce.cuisine_id = ?
      GROUP BY e.equipment_type_id
      ORDER BY e.name ASC
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [cuisineId]);
    return rows;
  }

  async create(cuisineId: number, equipmentId: number) {
    const sql = `
      INSERT INTO cuisine_equipment (cuisine_id, equipment_id) VALUES (?, ?)
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [cuisineId, equipmentId]);
    return row;
  }

  async delete(cuisineId: number, equipmentId: number) {
    const sql = `
      DELETE FROM cuisine_equipment WHERE cuisine_id = ? AND equipment_id = ?
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [cuisineId, equipmentId]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ICuisineEquipment {
  pool: Pool;
  viewByCuisineId(cuisineId: number): Data;
  create(cuisineId: number, equipmentId: number): Data;
  delete(cuisineId: number, equipmentId: number): Data;
}