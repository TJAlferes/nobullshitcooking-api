import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL';

export class EquipmentTypeRepo extends MySQLRepo implements EquipmentTypeRepoInterface {
  async viewAll() {
    const sql = `SELECT equipment_type_id, equipment_type_name FROM equipment_type`;
    const [ rows ] = await this.pool.execute<EquipmentTypeView[]>(sql);
    return rows;
  }

  async viewOne(equipment_type_id: number) {
    const sql = `SELECT equipment_type_id, equipment_type_name FROM equipment_type WHERE equipment_type_id = ?`;
    const [ [ row ] ] = await this.pool.execute<EquipmentTypeView[]>(sql, [equipment_type_id]);
    return row;
  }
}

export interface EquipmentTypeRepoInterface {
  viewAll: () =>                          Promise<EquipmentTypeView[]>;
  viewOne: (equipment_type_id: number) => Promise<EquipmentTypeView>;
}

type EquipmentTypeView = RowDataPacket & {
  equipment_type_id:   number;
  equipment_type_name: string;
};
