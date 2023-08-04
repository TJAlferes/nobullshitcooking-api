import { Pool, RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from './MySQL';

export class EquipmentTypeRepo extends MySQLRepo implements IEquipmentTypeRepo {
  async viewAll() {
    const sql = `SELECT id, name FROM equipment_type`;
    const [ rows ] = await this.pool.execute<EquipmentType[]>(sql);
    return rows;
  }

  async viewOne(id: number) {
    const sql = `SELECT id, name FROM equipment_type WHERE id = ?`;
    const [ row ] = await this.pool.execute<EquipmentType[]>(sql, [id]);
    return row;
  }
}

export interface IEquipmentTypeRepo {
  pool:    Pool;
  viewAll: () =>           Promise<EquipmentType[]>;
  viewOne: (id: number) => Promise<EquipmentType[]>;
}

type EquipmentType = RowDataPacket & {
  id:   number;
  name: string;
};
