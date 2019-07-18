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

  async createRecipeEquipment(recipeEquipment, recipeEquipmentPlaceholders, generatedId) {
    const sql = `
      INSERT INTO nobsc_recipe_equipment (recipe_id, equipment_id, amount)
      VALUES ${recipeEquipmentPlaceholders} 
    `;
    let recipeEquipmentParams = [];
    recipeEquipment.map(rE => {
      recipeEquipmentParams.push(generatedId, rE.equipmentId, rE.amount);
    });
    const [ createdRecipeEquipment ] = await this.pool.execute(sql, recipeEquipmentParams);
  }

  async updateRecipeEquipment() {
    const sql = `
      UPDATE nobsc_recipe_equipment
      SET equipment_id = ? amount = ?
      WHERE recipe_id = ?
      LIMIT 1;
    `;

  }

  async deleteRecipeEquipment() {
    const sql = `
      DELETE
      FROM nobsc_recipe_equipment
      where recipe_id = ? AND equipment
    `;

  }
}

module.exports = RecipeEquipment;