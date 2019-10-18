class Equipment {
  constructor(pool) {
    this.pool = pool;

    this.getAllPublicEquipmentForElasticSearchBulkInsert = this.getAllPublicEquipmentForElasticSearchBulkInsert.bind(this);

    // public NOBSC equipment
    this.countAllEquipment = this.countAllEquipment.bind(this);
    this.countEquipmentOfType = this.countEquipmentOfType.bind(this);
    this.countEquipmentOfTypes = this.countEquipmentOfTypes.bind(this);

    this.viewAllEquipment = this.viewAllEquipment.bind(this);
    this.viewEquipmentOfType = this.viewEquipmentOfType.bind(this);
    this.viewEquipmentOfTypes = this.viewEquipmentOfTypes.bind(this);

    this.viewAllOfficialEquipment = this.viewAllOfficialEquipment.bind(this);

    this.viewEquipmentById = this.viewEquipmentById.bind(this);

    this.createEquipment = this.createEquipment.bind(this);
    this.updateEquipment = this.updateEquipment.bind(this);
    this.deleteEquipment = this.deleteEquipment.bind(this);

    // private user equipment
    this.viewAllMyPrivateUserEquipment = this.viewAllMyPrivateUserEquipment.bind(this);
    this.viewMyPrivateUserEquipment = this.viewMyPrivateUserEquipment.bind(this);
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

  //--------------------------------------------------------------------------

  /*
  
  public NOBSC equipment

  */

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
      LIMIT ?, ?
    `;
    const [ allEqupimentOfType ] = await this.pool.execute(sql, [typeId, starting, display]);
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

  async viewAllOfficialEquipment() {
    const sql = `
      SELECT equipment_id, equipment_type_id, equipment_name, equipment_image
      FROM nobsc_equipment
      WHERE owner_id = 1
      ORDER BY equipment_name ASC
    `;
    const [ allOfficialEquipment ] = await this.pool.execute(sql);
    return allOfficialEquipment;
  }

  async viewEquipmentById(equipmentId) {
    const sql = `
      SELECT
        e.equipment_id AS equipment_id,
        t.equipment_type_name AS equipment_type_name
        e.equipment_name AS equipment_name,
        e.equipment_description AS equipment_description
        e.equipment_image AS equipment_image
      FROM nobsc_equipment e
      INNER JOIN nobsc_equipment_types t ON e.equipment_type_id = t.equipment_type_id
      WHERE owner_id = 1 AND equipment_id = ?
    `;
    const [ equipment ] = await this.pool.execute(sql, [equipmentId]);
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



  /*

  private user equipment

  */
 
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

  async viewMyPrivateUserEquipment(ownerId, equipmentId) {
    const sql = `
      SELECT
        e.equipment_id AS equipment_id,
        t.equipment_type_name AS equipment_type_name
        e.equipment_name AS equipment_name,
        e.equipment_description AS equipment_description
        e.equipment_image AS equipment_image
      FROM nobsc_equipment e
      INNER JOIN nobsc_equipment_types t ON e.equipment_type_id = t.equipment_type_id
      WHERE owner_id = ? AND equipment_id = ?
    `;
    const [ myPrivateUserEquipment ] = await this.pool.execute(sql, [ownerId, equipmentId]);
    return myPrivateUserEquipment;
  }

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