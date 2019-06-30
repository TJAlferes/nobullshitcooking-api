class UserEquipment {
  constructor(xdevpool) {
    this.xdevpool = xdevpool;
    this.viewUserEquipment = this.viewUserEquipment.bind(this);
    this.viewUserEquipmentDetail = this.viewUserEquipmentDetail.bind(this);
    this.createUserEquipment = this.createUserEquipment.bind(this);
    this.updateUserEquipment = this.updateUserEquipment.bind(this);
    this.deleteUserEquipment = this.deleteUserEquipment.bind(this);
  }

  async viewAllUserEquipment(userInfo) {
    const { userId } = userInfo;
    const sql = `
      SELECT equipment
      FROM nobsc_users
      WHERE user_id = ?
    `;
    const [ allUserEquipment ] = await this.pool.execute(sql, [userId]);
    if (!allUserEquipment) throw new Error("viewAllUserEquipment failed");
    return allUserEquipment;
  }

  async viewUserEquipmentDetail(userInfo) {
    const { userId, equipmentId } = userInfo;
    const sql = `
      SELECT
      equipment->'$.user_equipment_name',
      equipment->'$.user_equipment_image',
      equipment->'$.user_equipment_description'
      FROM nobsc_users
      WHERE user_id = ? AND equipment->'$.user_equipment_id' = ?
    `;
    const [ userEquipment ] = await this.pool.execute(sql, [userId, equipmentId]);
    if (!userEquipment) throw new Error("viewUserEquipmentDetail failed");
    return userEquipment;
  }

  async createUserEquipment(equipmentToCreate, equipmentId, userId) {
    const {
      equipmentTypeId,
      equipmentName,
      equipmentImage,
      equipmentDescription
    } = equipmentToCreate;
    const sql = `
      UPDATE nobsc_users
      SET equipment = JSON_INSERT(
        equipment,
        '$.user_equipment_id', ?,
        '$.user_equipment_type_id', ?,
        '$.user_equipment_name', ?,
        '$.user_equipment_image', ?,
        '$.user_equipment_description', ?
      )
      WHERE user_id = ?
      LIMIT 1
    `;
    const [ createdUserEquipment ] = await this.pool.execute(sql, [
      equipmentId,
      equipmentTypeId,
      equipmentName,
      equipmentImage,
      equipmentDescription,
      userId
    ]);
    return createdUserEquipment;
  }

  async updateUserEquipment(equipmentToUpdate, equipmentId, userId) {
    const {
      equipmentTypeId,
      equipmentName,
      equipmentImage,
      equipmentDescription
    } = equipmentToUpdate;

    /*const sql = `
      UPDATE nobsc_users
      SET equipment = JSON_REPLACE(
        equipment,
        '$.user_equipment_type_id', ?,
        '$.user_equipment_name', ?,
        '$.user_equipment_image', ?,
        '$.user_equipment_description', ?
      )
      WHERE equipment->'$.user_equipment_id' = ? AND user_id = ?
      LIMIT 1
    `;*/
    // JSON_INSERT -- if not exist, add
    // JSON_REPLACE -- if exist, replace
    // JSON_SET -- if not exist, add, else, replace

    const sql = `
      UPDATE nobsc_users
      SET equipment = JSON_REPLACE(
        equipment,

        '$.user_equipment_type_id', ?,
        '$.user_equipment_name', ?,
        '$.user_equipment_image', ?,
        '$.user_equipment_description', ?
      )
      WHERE equipment->'$.user_equipment_id' = ? AND user_id = ?
      LIMIT 1
    `;

    const [ updatedUserEquipment ] = await this.pool.execute(sql, [
      equipmentTypeId,
      equipmentName,
      equipmentImage,
      equipmentDescription,
      equipmentId,
      userId
    ]);
    return updatedUserEquipment;
  }

  async deleteUserEquipment(equipmentId, userId) {
    const sql = `
      UPDATE nobsc_users
      SET equipment = JSON_REMOVE(
        equipment,
        REPLACE(
          JSON_SEARCH(
            equipment,
            'one',
            ?,
            NULL,
            '$**.user_equipment_id'
          ),
          '"',
          ''
        )
      )
      WHERE user_id = ?
      LIMIT 1
    `;
    const [ deletedUserEquipment ] = await this.pool.execute(sql, [equipmentId, userId]);
    return deletedUserEquipment;
  }
}

module.exports = UserEquipment;