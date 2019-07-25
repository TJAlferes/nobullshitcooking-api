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
    this.viewEquipmentForSubmitEditForm = viewEquipmentForSubmitEditForm.bind(this);
    this.createEquipment = this.createEquipment.bind(this);
    this.updateEquipment = this.updateEquipment.bind(this);
    this.deleteEquipment = this.deleteEquipment.bind(this);

    this.viewAllMyPrivateUserEquipment = this.viewAllMyPrivateUserEquipment.bind(this);
    this.viewMyPrivateUserEquipment = this.viewMyPrivateUserEquipment.bind(this);
    this.createMyPrivateUserEquipment = this.createMyPrivateUserEquipment.bind(this);
    this.updateMyPrivateUserEquipment = this.updateMyPrivateUserEquipment.bind(this);
    this.deleteMyPrivateUserEquipment = this.deleteMyPrivateUserEquipment.bind(this);
  }
  
  async countAllEquipment() {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_equipment
      WHERE owner_id = 1
    `;
    const [ allEquipmentCount ] = await this.pool.execute(sql);
    return allEquipmentCount;
  }

  async countEquipmentOfType(typeId) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_equipment
      WHERE equipment_type_id = ? AND owner_id = 1
    `;
    const [ allEquipmentOfTypeCount ] = await this.pool.execute(sql, [typeId]);
    return allEquipmentOfTypeCount;
  }

  async countEquipmentOfTypes(placeholders, typeIds) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_equipment
      WHERE equipment_type_id IN (${placeholders}) AND owner_id = 1
    `;
    const [ allEquipmentOfTypesCount ] = await this.pool.execute(sql, typeIds);
    return allEquipmentOfTypesCount;
  }

  async viewAllEquipment(starting, display) {
    const sql = `
      SELECT equipment_id, equipment_name, equipment_type_id, equipment_image
      FROM nobsc_equipment
      WHERE owner_id = 1
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
      WHERE equipment_type_id = ? AND owner_id = 1
      ORDER BY equipment_name ASC
      LIMIT ${starting}, ${display}
    `;  // TO DO: change to ? for security
    const [ allEqupimentOfType ] = await this.pool.execute(sql, [typeId]);
    return allEqupimentOfType;
  }

  async viewEquipmentOfTypes(starting, display, placeholders, typeIds) {
    const sql = `
      SELECT equipment_id, equipment_name, equipment_type_id, equipment_image
      FROM nobsc_equipment
      WHERE equipment_type_id IN (${placeholders}) AND owner_id = 1
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
      WHERE equipment_id = ? AND owner_id = 1
    `;  // ... Is this right? LEFT TO INNER?
    const [ equipment ] = await this.pool.execute(sql, [equipmentId]);
    return equipment;
  }

  async viewEquipmentForSubmitEditForm() {
    const sql = `
      SELECT equipment_id, equipment_type_id, equipment_name
      FROM nobsc_equipment
      ORDER BY equipment_name ASC
    `;
    const [ allEquipment ] = await this.pool.execute(sql);
    return allEquipment;
  }

  async viewAllMyPrivateUserEquipment(ownerId) {
    const sql = `
      SELECT equipment_id, equipment_name, equipment_image
      FROM nobsc_equipment
      WHERE owner_id = ?
      ORDER BY equipment_name ASC
    `;
    const [ allMyPrivateUserEquipment ] = await this.pool.execute(sql, [ownerId]);
    return allMyPrivateUserEquipment;
  }

  async viewMyPrivateUserEquipment(equipmentId, ownerId) {
    const sql = `
      SELECT
        e.equipment_id AS equipment_id,
        e.equipment_name AS equipment_name,
        e.equipment_type_id AS equipment_type,
        e.equipment_image AS equipment_image,
        t.equipment_type_name AS equipment_type_name
      FROM nobsc_equipment e
      INNER JOIN nobsc_equipment_types t ON t.equipment_type_id = e.equipment_type_id
      WHERE equipment_id = ? AND owner_id = ?
    `;
    const [ myPrivateUserEquipment ] = await this.pool.execute(sql, [equipmentId, ownerId]);
    return myPrivateUserEquipment;
  }

  async createEquipment(equipmentInfo) {
    const {
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    } = equipmentInfo;
    const sql = `
      INSERT INTO nobsc_equipment (
        equipment_type_id,
        author_id,
        owner_id,
        equipment_name,
        equipment_description,
        equipment_image
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ createdEquipment ] = await this.pool.execute(sql, [
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    ]);
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



  async viewAllMyPrivateUserEquipment(userId) {
    const sql = `
      SELECT equipment_id, equipment_name, equipment_image
      FROM nobsc_equipment
      WHERE owner_id = ?
    `;
    const [ allMyPrivateUserEquipment ] = await this.pool.execute(sql, [userId]);
    return allMyPrivateUserEquipment;
  }

  async viewMyPrivateUserEquipment(userId, equipmentId) {
    const sql = `
      SELECT
        e.equipment_id AS equipment_id,
        t.equipment_type_name AS equipment_type_name
        e.equipment_name AS equipment_name,
        e.equipment_description AS equipment_description
        e.equipment_image AS equipment_image
      FROM nobsc_equipment e
      INNER JOIN nobsc_equipment_types t ON e.equipment_type_id = t.equipment_type_id
      WHERE e.owner_id = ? AND e.equipment_id = ?
    `;
    const [ myPrivateUserEquipment ] = await this.pool.execute(sql, [userId, equipmentId]);
    return myPrivateUserEquipment;
  }

  async createMyPrivateUserEquipment() {
    const sql = `
    
    `;
    const [  ] = await this.pool.execute(sql, []);
    return ;
  }

  async updateMyPrivateUserEquipment() {
    const sql = `
    
    `;
    const [  ] = await this.pool.execute(sql, []);
    return ;
  }

  async deleteMyPrivateUserEquipment(equipmentId, authorId, ownerId) {
    const sql = `
      DELETE
      FROM nobsc_equipment
      WHERE equipment_id = ? AND author_id = ? AND owner_id = ?
      LIMIT 1
    `;
    const [ deletedPrivateUserEquipment ] = await this.pool.execute(sql, [
      equipmentId,
      authorId,
      ownerId
    ]);
    return deletedPrivateUserEquipment;
  }
}

module.exports = Equipment;