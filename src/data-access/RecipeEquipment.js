class RecipeEquipment {
  constructor(pool) {
    this.pool = pool;
    this.viewRecipeEquipmentByRecipeId = this.viewRecipeEquipmentByRecipeId.bind(this);
    this.viewRecipeEquipmentForEditFormByRecipeId = this.viewRecipeEquipmentForEditFormByRecipeId.bind(this);
    this.createRecipeEquipment = this.createRecipeEquipment.bind(this);
    this.updateRecipeEquipment = this.updateRecipeEquipment.bind(this);
    this.deleteRecipeEquipment = this.deleteRecipeEquipment.bind(this);
  }

  async viewRecipeEquipmentByRecipeId(recipeId) {
    const sql = `
      SELECT re.amount, e.equipment_name
      FROM nobsc_recipe_equipment re
      INNER JOIN nobsc_equipment e ON e.equipment_id = re.equipment_id
      WHERE re.recipe_id = ?
      ORDER BY e.equipment_type_id
    `;
    const [ recipeEquipment ] = await this.pool.execute(sql, [recipeId]);
    return recipeEquipment;
  }

  async viewRecipeEquipmentForEditFormByRecipeId(recipeId) {
    const sql = `
      SELECT amount, equipment_id
      FROM nobsc_recipe_equipment
      WHERE recipe_id = ?
    `;
    const [ recipeEquipment ] = await this.pool.execute(sql, [recipeId]);
    return recipeEquipment;
  }

  async createRecipeEquipment(recipeEquipment, recipeEquipmentPlaceholders) {
    const sql = `
      INSERT INTO nobsc_recipe_equipment (recipe_id, equipment_id, amount)
      VALUES ${recipeEquipmentPlaceholders} 
    `;
    const [ createdRecipeEquipment ] = await this.pool.execute(sql, recipeEquipment);
    return createdRecipeEquipment;
  }

  async updateRecipeEquipment(recipeEquipment, recipeEquipmentPlaceholders, recipeId) {
    /*const connection = await this.pool.getConnection();
    try {
      await connection.query('START TRANSACTION');
      await query(
        'INSERT INTO `tbl_activity_log` (dt, tm,userid,username,activity) VALUES(?,?,?,?,?)',
        ['2019-02-21', '10:22:01', 'S', 'Pradip', 'RAhul3']
      );
      await dbCon.query(
        'INSERT INTO `tbl_activity_log` (dt, tm,userid,username,activity) VALUES(?,?,?,?,?)',
        ['2019-02-21', '10:22:01', 'S', 'Pradip','this is test and the valid out put is this and then']
      );
      await connection.release();
    } catch(e) {
      await connection.query('ROLLBACK');
      await connection.release();
    }*/
    const sql1 = `
      DELETE
      FROM nobsc_recipe_equipment
      WHERE recipe_id = ?
    `;
    const sql2 = `
      INSERT INTO nobsc_recipe_equipment (recipe_id, equipment_id, amount)
      VALUES ${recipeEquipmentPlaceholders} 
    `;
    try {
      await this.pool.execute('START TRANSACTION');
      await this.pool.execute(sql1, [recipeId]);
      await this.pool.execute(sql2, [recipeEquipment]);
      await this.pool.execute('COMMIT');
    } catch (err) {
      await this.pool.query
    }
  }

  async deleteRecipeEquipment(recipeId) {
    const sql = `
      DELETE
      FROM nobsc_recipe_equipment
      WHERE recipe_id = ?
    `;
    const [ deletedRecipeEquipment ] = await this.pool.execute(sql, [recipeId]);
    return deletedRecipeEquipment;
  }
}

module.exports = RecipeEquipment;