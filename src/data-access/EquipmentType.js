class EquipmentType {
  constructor(pool) {
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

  async viewEquipmentTypeById(typeId) {
    const sql = `
      SELECT equipment_type_id, equipment_type_name
      FROM nobsc_equipment_types
      WHERE equipment_type_id = ?
    `;
    const [ equipmentType ] = await this.pool.execute(sql, [typeId]);
    return equipmentType;
  }
}

module.exports = EquipmentType;