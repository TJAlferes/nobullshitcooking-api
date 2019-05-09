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
  
  async countAllEquipment() {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_equipment
    `;
    const [ allEquipmentCount ] = await this.pool.execute(sql);
    return allEquipmentCount;
  }

  async countEquipmentOfType(typeId) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_equipment
      WHERE equipment_type_id = ?
    `;
    const [ allEquipmentOfTypeCount ] = await this.pool.execute(sql, [typeId]);
    return allEquipmentOfTypeCount;
  }

  async countEquipmentOfTypes(placeholders, typeIds) {  // typeIds must be an array
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_equipment
      WHERE equipment_type_id IN (${placeholders})
    `;
    const [ allEquipmentOfTypesCount ] = await this.pool.execute(sql, typeIds);
    return allEquipmentOfTypesCount;
  }

  async viewAllEquipment(starting, display) {
    const sql = `
      SELECT equipment_id, equipment_name, equipment_type_id, equipment_image
      FROM nobsc_equipment
      ORDER BY equipment_name ASC
      LIMIT ?, ?
    `;
    const [ allEqupiment ] = await this.pool.execute(sql, [starting, display]);
    return allEqupiment;
  }

  async viewEquipmentOfType(starting, display, typeId) {
    const sql = `
      SELECT equipment_id, equipment_name, equipment_type_id, equipment_image
      FROM nobsc_equipment
      WHERE equipment_type_id = ?
      ORDER BY equipment_name ASC
      LIMIT ${starting}, ${display}
    `;  // TO DO: change to ? for security
    const [ allEqupimentOfType ] = await this.pool.execute(sql, [typeId]);
    return allEqupimentOfType;
  }

  async viewEquipmentOfTypes(starting, display, placeholders, typeIds) {  // typeIds must be an array
    const sql = `
      SELECT equipment_id, equipment_name, equipment_type_id, equipment_image
      FROM nobsc_equipment
      WHERE equipment_type_id IN (${placeholders})
      ORDER BY equipment_name ASC
      LIMIT ${starting}, ${display}
    `;  // TO DO: change to ? for security
    const [ allEqupimentOfTypes ] = await this.pool.execute(sql, typeIds);
    return allEqupimentOfTypes;
  }

  async viewEquipmentById(equipmentId) {
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
    const [ equipment ] = await this.pool.execute(sql, [equipmentId]);
    return equipment;
  }

  async createEquipment(equipmentInfo) {
    const { id, name, typeId, image } = equipmentInfo;
    const sql = `
      INSERT INTO nobsc_equipment
      (equipment_id, equipment_name, equipment_type_id, equipment_image)
      VALUES
      (?, ?, ?, ?)
    `;
    const [ createdEquipment ] = await this.pool.execute(sql, [id, name, typeId, image]);
    return createdEquipment;
  }

  async updateEquipment(equipmentInfo) {
    const { id, name, typeId, image } = equipmentInfo;
    const sql = `
      UPDATE nobsc_equipment
      SET equipment_name = ?, equipment_type_id = ?, equipment_image = ?
      WHERE equipment_id = ?
      LIMIT 1
    `;
    const [ updatedEquipment ] = await this.pool.execute(sql, [name, typeId, image, id]);
    return updatedEquipment;
  }

  async deleteEquipment(equipmentId) {
    const sql = `
      DELETE
      FROM nobsc_equipment
      WHERE equipment_id = ?
      LIMIT 1
    `;
    const [ deletedEquipment ] = await this.pool.execute(sql, [equipmentId]);
    return deletedEquipment;
  }
}

module.exports = Equipment;