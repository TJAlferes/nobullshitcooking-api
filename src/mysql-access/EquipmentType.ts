import { Pool, RowDataPacket } from 'mysql2/promise';

export class EquipmentType {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewAllEquipmentTypes = this.viewAllEquipmentTypes.bind(this);
    this.viewEquipmentTypeById = this.viewEquipmentTypeById.bind(this);
  }

  async viewAllEquipmentTypes() {
    const sql = `
      SELECT equipment_type_id, equipment_type_name
      FROM nobsc_equipment_types
    `;
    const [ allEquipmentTypes ] = await this.pool.execute(sql);
    return allEquipmentTypes;
  }

  async viewEquipmentTypeById(typeId: number) {
    const sql = `
      SELECT equipment_type_id, equipment_type_name
      FROM nobsc_equipment_types
      WHERE equipment_type_id = ?
    `;
    const [ equipmentType ] = await this.pool.execute(sql, [typeId]);
    return equipmentType;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IEquipmentType {
  pool: Pool;
}