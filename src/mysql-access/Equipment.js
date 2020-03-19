class Equipment {
  constructor(pool) {
    this.pool = pool;

    this.getAllPublicEquipmentForElasticSearchBulkInsert = this.getAllPublicEquipmentForElasticSearchBulkInsert.bind(this);
    this.getEquipmentForElasticSearchInsert = this.getEquipmentForElasticSearchInsert.bind(this);

    this.viewEquipment = this.viewEquipment.bind(this);
    this.viewEquipmentById = this.viewEquipmentById.bind(this);
    this.createEquipment = this.createEquipment.bind(this);
    this.updateEquipment = this.updateEquipment.bind(this);
    this.deleteEquipment = this.deleteEquipment.bind(this);

    this.createMyPrivateUserEquipment = this.createMyPrivateUserEquipment.bind(this);
    this.updateMyPrivateUserEquipment = this.updateMyPrivateUserEquipment.bind(this);
    this.deleteMyPrivateUserEquipment = this.deleteMyPrivateUserEquipment.bind(this);
  }
  
  //--------------------------------------------------------------------------

  async getAllPublicEquipmentForElasticSearchBulkInsert() {
    try {
      const ownerId = 1;
      const sql1 = `
        SELECT
          e.equipment_id AS equipmentId,
          et.equipment_type_name AS equipmentTypeName,
          e.equipment_name AS equipmentName,
          e.equipment_image AS equipmentImage
        FROM nobsc_equipment e
        INNER JOIN nobsc_equipment_types et ON et.equipment_type_id = e.equipment_type_id
        WHERE e.owner_id = ?
      `;
      const [ equipmentForBulkInsert ] = await this.pool.execute(sql1, [ownerId]);
      let final = [];
      for (let equipment of equipmentForBulkInsert) {  // allows the sequence of awaits we want
        const { equipmentId } = equipment;
        final.push(
          {index: {_index: 'equipment', _id: equipmentId}},
          equipment
        );
      }
      return final;
    } catch (err) {
      console.log(err);
    }
  }

  async getEquipmentForElasticSearchInsert(equipmentId, ownerId) {
    const sql = `
      SELECT
        e.equipment_id AS equipmentId,
        et.equipment_type_name AS equipmentTypeName,
        e.equipment_name AS equipmentName,
        e.equipment_image AS equipmentImage
      FROM nobsc_equipment e
      INNER JOIN nobsc_equipment_types et ON et.equipment_type_id = e.equipment_type_id
      WHERE e.equipment_id = ? e.owner_id = ?
    `;
    const [ equipmentForInsert ] = await this.pool.execute(sql, [
      equipmentId,
      ownerId
    ]);
    /*const { equipmentId } = equipmentForInsert;
    return [
      {index: {_index: 'equipment', _id: equipmentId}},
      equipmentForInsert
    ];*/
    return equipmentForInsert;
  }

  //--------------------------------------------------------------------------

  async viewEquipment(authorId, ownerId) {
    const sql = `
      SELECT
        e.equipment_id AS equipment_id,
        e.equipment_type_id AS equipment_type_id,
        e.owner_id AS owner_id,
        t.equipment_type_name AS equipment_type_name,
        e.equipment_name AS equipment_name,
        e.equipment_description AS equipment_description,
        e.equipment_image AS equipment_image
      FROM nobsc_equipment e
      INNER JOIN nobsc_equipment_types t ON e.equipment_type_id = t.equipment_type_id
      WHERE e.author_id = ? AND e.owner_id = ?
      ORDER BY equipment_name ASC
    `;
    const [ equipment ] = await this.pool
    .execute(sql, [authorId, ownerId]);
    return equipment;
  }

  async viewEquipmentById(equipmentId, authorId, ownerId) {
    const sql = `
      SELECT
        e.equipment_id AS equipment_id,
        e.equipment_type_id AS equipment_type_id,
        e.owner_id AS owner_id,
        t.equipment_type_name AS equipment_type_name,
        e.equipment_name AS equipment_name,
        e.equipment_description AS equipment_description,
        e.equipment_image AS equipment_image
      FROM nobsc_equipment e
      INNER JOIN nobsc_equipment_types t ON e.equipment_type_id = t.equipment_type_id
      WHERE e.equipment_id = ? AND e.author_id = ? AND e.owner_id = ?
    `;
    const [ equipment ] = await this.pool
    .execute(sql, [equipmentId, authorId, ownerId]);
    return equipment;
  }

  async createEquipment(equipmentToCreate) {
    const {
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    } = equipmentToCreate;
    const sql = `
      INSERT INTO nobsc_equipment
      (equipment_type_id, author_id, owner_id, equipment_name, equipment_description, equipment_image) 
      VALUES (?, ?, ?, ?, ?, ?)
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

  async updateEquipment(equipmentToUpdateWith, equipmentId) {
    const {
      equipmentTypeId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    } = equipmentToUpdateWith;
    const sql = `
      UPDATE nobsc_equipment
      SET
        equipment_type_id = ?,
        equipment_name = ?,
        equipment_description = ?,
        equipment_image = ?
      WHERE equipment_id = ?
      LIMIT 1
    `;
    const [ updatedEquipment ] = await this.pool.execute(sql, [
      equipmentTypeId,
      equipmentName,
      equipmentDescription,
      equipmentImage,
      equipmentId
    ]);
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

  //--------------------------------------------------------------------------

  async createMyPrivateUserEquipment(equipmentToCreate) {
    const {
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    } = equipmentToCreate;
    const sql = `
      INSERT INTO nobsc_equipment
      (equipment_type_id, author_id, owner_id, equipment_name, equipment_description, equipment_image)
      VALUES
      (?, ?, ?, ?, ?, ?)
    `;
    const [ createdPrivateUserEquipment ] = await this.pool.execute(sql, [
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    ]);
    return createdPrivateUserEquipment;
  }

  async updateMyPrivateUserEquipment(equipmentToUpdateWith, equipmentId) {
    const {
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage
    } = equipmentToUpdateWith;
    const sql = `
      UPDATE nobsc_equipment
      SET
        equipment_type_id = ?,
        author_id = ?,
        owner_id = ?,
        equipment_name = ?,
        equipment_description = ?,
        equipment_image = ?
      WHERE owner_id = ? AND equipment_id = ?
      LIMIT 1
    `;
    const [ updatedPrivateUserEquipment ] = await this.pool.execute(sql, [
      equipmentTypeId,
      authorId,
      ownerId,
      equipmentName,
      equipmentDescription,
      equipmentImage,
      ownerId,
      equipmentId
    ]);
    return updatedPrivateUserEquipment;
  }

  async deleteMyPrivateUserEquipment(ownerId, equipmentId) {
    const sql = `
      DELETE
      FROM nobsc_equipment
      WHERE owner_id = ? AND equipment_id = ?
      LIMIT 1
    `;
    const [ deletedPrivateUserEquipment ] = await this.pool.execute(sql, [ownerId, equipmentId]);
    return deletedPrivateUserEquipment;
  }
}

module.exports = Equipment;