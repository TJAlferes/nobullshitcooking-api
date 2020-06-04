import { Pool, RowDataPacket } from 'mysql2/promise';

export class EquipmentType implements IEquipmentType {
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
    const [ allEquipmentTypes ] = await this.pool.execute<RowDataPacket[]>(sql);
    return allEquipmentTypes;
  }

  async viewEquipmentTypeById(equipmentTypeId: number) {
    const sql = `
      SELECT equipment_type_id, equipment_type_name
      FROM nobsc_equipment_types
      WHERE equipment_type_id = ?
    `;
    const [ equipmentType ] = await this.pool
    .execute<RowDataPacket[]>(sql, [equipmentTypeId]);
    return equipmentType;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IEquipmentType {
  pool: Pool;
  viewAllEquipmentTypes(): Data;
  viewEquipmentTypeById(equipmentTypeId: number): Data;
}