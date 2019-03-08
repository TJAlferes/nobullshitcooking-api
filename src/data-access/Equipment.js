class Equipment {
  constructor(pool) {
    this.pool = pool;
    this.countAllEquipment = this.countAllEquipment.bind(this);
    this.countEquipmentOfType = this.countEquipmentOfType.bind(this);
    this.countEquipmentOfTypes = this.countEquipmentOfTypes.bind(this);
    this.viewAllEquipment = this.viewAllEquipment.bind(this);
    this.viewEquipmentOfType = this.viewEquipmentOfType.bind(this);
    this.viewEquipmentOfTypes = this.viewEquipmentOfTypes.bind(this);
    this.viewEquipmentById = this.viewEquipmentById.bind(this);
    this.createEquipment = this.createEquipment.bind(this);
    this.updateEquipment = this.updateEquipment.bind(this);
    this.deleteEquipment = this.deleteEquipment.bind(this);
  }
  
  countAllEquipment() {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_equipment
    `;
    return pool.execute(sql);
  }

  countEquipmentOfType(typeId) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_equipment
      WHERE equipment_type_id = ?
    `;
    return pool.execute(sql, [typeId]);
  }

  countEquipmentOfTypes(placeholders, typeIds) {  // typeIds must be an array
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_equipment
      WHERE equipment_type_id IN (${placeholders})
    `;
    return pool.execute(sql, typeIds);
  }

  viewAllEquipment(starting, display) {
    const sql = `
      SELECT equipment_id, equipment_name, equipment_type_id, equipment_image
      FROM nobsc_equipment
      ORDER BY equipment_name ASC
      LIMIT ${starting}, ${display}
    `;
    return pool.execute(sql);
  }

  viewEquipmentOfType(starting, display, typeId) {
    const sql = `
      SELECT equipment_id, equipment_name, equipment_type_id, equipment_image
      FROM nobsc_equipment
      WHERE equipment_type_id = ?
      ORDER BY equipment_name ASC
      LIMIT ${starting}, ${display}
    `;
    return pool.execute(sql, [typeId]);
  }

  viewEquipmentOfTypes(starting, display, placeholders, typeIds) {  // typeIds must be an array
    const sql = `
      SELECT equipment_id, equipment_name, equipment_type_id, equipment_image
      FROM nobsc_equipment
      WHERE equipment_type_id IN (${placeholders})
      ORDER BY equipment_name ASC
      LIMIT ${starting}, ${display}
    `;
    return pool.execute(sql, typeIds);
  }

  viewEquipmentById(equipmentId) {
    const sql = `
      SELECT
        e.equipment_id AS equipment_id,
        e.equipment_name AS equipment_name,
        e.equipment_type_id AS equipment_type_id,
        e.equipment_image AS equipment_image,
        t.equipment_type_name AS equipment_type_name
      FROM nobsc_equipment_types t
      LEFT JOIN nobsc_equipment e ON e.equipment_type_id = t.equipment_type_id
      WHERE equipment_id = ?
    `;  // ... Is this right?
    return pool.execute(sql, [equipmentId]);
  }

  createEquipment(equipmentInfo) {
    const { id, name, typeId, image } = equipmentInfo;
    const sql = `
      INSERT INTO nobsc_equipment
      (equipment_id, equipment_name, equipment_type_id, equipment_image)
      VALUES
      (?, ?, ?, ?)
    `;
    return pool.execute(sql, [id, name, typeId, image]);
  }

  updateEquipment(equipmentInfo) {
    const { id, name, typeId, image } = equipmentInfo;
    const sql = `
      UPDATE nobsc_equipment
      SET equipment_name = ?, equipment_type_id = ?, equipment_image = ?
      WHERE equipment_id = ?
      LIMIT 1
    `;
    return pool.execute(sql, [name, typeId, image, id]);
  }

  deleteEquipment(equipmentId) {
    const sql = `
      DELETE
      FROM nobsc_equipment
      WHERE equipment_id = ?
      LIMIT 1
    `;
    return pool.execute(sql, [equipmentId]);
  }
}

module.exports = Equipment;