import { Pool, RowDataPacket } from 'mysql2/promise';

export class EquipmentTypeRepository implements IEquipmentTypeRepository {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewAll() {
    const sql = `SELECT id, name FROM equipment_types`;
    const [ rows ] = await this.pool.execute<EquipmentType[]>(sql);
    return rows;
  }

  async viewOne(id: number) {
    const sql = `SELECT id, name FROM equipment_types WHERE id = ?`;
    const [ row ] = await this.pool.execute<EquipmentType[]>(sql, [id]);
    return row;
  }
}

export interface IEquipmentTypeRepository {
  pool:    Pool;
  viewAll: () =>           Promise<EquipmentType[]>;
  viewOne: (id: number) => Promise<EquipmentType[]>;
}

type EquipmentType = RowDataPacket & {
  id:   number;
  name: string;
};
