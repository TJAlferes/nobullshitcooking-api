class RecipeEquipment {
  constructor(pool) {
    this.pool = pool;
    this.viewRecipeEquipmentByRecipeId = this.viewRecipeEquipmentByRecipeId.bind(this);
    this.createRecipeEquipment = this.createRecipeEquipment.bind(this);
    this.updateRecipeEquipment = this.updateRecipeEquipment.bind(this);
    this.deleteRecipeEquipment = this.deleteRecipeEquipment.bind(this);
  }

  async viewRecipeEquipmentByRecipeId(recipeId) {
    const sql = `
      SELECT re.amount e.equipment_name
      FROM nobsc_recipe_equipment re
      INNER JOIN nobsc_equipment e ON e.equipment_id = re.equipment_id
      INNER JOIN nobsc_equipment_types et ON e.equipment_type_id = et.equipment_type_id
      WHERE re.recipe_id = ?
      ORDER BY equipment_type_id
    `;
    const [ recipeEquipment ] = await this.pool.execute(sql, [recipeId]);
  }

  async createRecipeEquipment(recipeEquipment) {
    const sql = `
      INSERT INTO nobsc_recipe_equipment (recipe_id, equipment_id, amount)
      VALUES ${recipeEquipmentPlaceholders} 
    `;
    let recipeEquipmentParams = [];
    recipeEquipment.map(rE => {
      recipeEquipmentParams.push(generatedId, rE.equipmentId, rE.amount);
    });
    const [ createdRecipeEquipment ] = await this.pool.execute(sql2, recipeEquipmentParams);
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