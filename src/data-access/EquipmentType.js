class EquipmentType {
  constructor(pool) {
    this.pool = pool;
    this.viewAllEquipmentTypes = this.viewAllEquipmentTypes.bind(this);
    this.viewEquipmentTypeById = this.viewEquipmentTypeById.bind(this);
  }

  viewAllEquipmentTypes() {
    const sql = `
      SELECT equipment_type_id, equipment_type_name
      FROM nobsc_equipment_types
    `;
    return pool.execute(sql);
  }

  viewEquipmentTypeById(typeId) {
    const sql = `
      SELECT equipment_type_id, equipment_type_name
      FROM nobsc_equipment_types
      WHERE equipment_type_id = ?
    `;
    return pool.execute(sql, [typeId]);
  }
}

module.exports = EquipmentType;