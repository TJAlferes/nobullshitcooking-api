import { Pool } from 'mysql2/promise';

export interface IRecipeEquipment {
  equipment: number
  amount: number
}

export class RecipeEquipment {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewRecipeEquipmentByRecipeId = this.viewRecipeEquipmentByRecipeId.bind(this);
    this.createRecipeEquipment = this.createRecipeEquipment.bind(this);
    this.updateRecipeEquipment = this.updateRecipeEquipment.bind(this);
    this.deleteRecipeEquipment = this.deleteRecipeEquipment.bind(this);
    this.deleteRecipeEquipmentByEquipmentId = this.deleteRecipeEquipmentByEquipmentId.bind(this);
  }

  async viewRecipeEquipmentByRecipeId(recipeId: number) {
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

  async createRecipeEquipment(
    recipeEquipment: number[],
    recipeEquipmentPlaceholders: string
  ) {
    const sql = `
      INSERT INTO nobsc_recipe_equipment (recipe_id, equipment_id, amount)
      VALUES ${recipeEquipmentPlaceholders} 
    `;

    const [ createdRecipeEquipment ] = await this.pool
    .execute(sql, recipeEquipment);

    return createdRecipeEquipment;
  }

  async updateRecipeEquipment(
    recipeEquipment: number[],
    recipeEquipmentPlaceholders: string,
    recipeId: number
  ) {
    const sql1 = `
      DELETE
      FROM nobsc_recipe_equipment
      WHERE recipe_id = ?
    `;

    const sql2 = (recipeEquipment.length)
    ? `
      INSERT INTO nobsc_recipe_equipment (recipe_id, equipment_id, amount)
      VALUES ${recipeEquipmentPlaceholders} 
    `
    : "none";

    const connection = await this.pool.getConnection();

    await connection.beginTransaction();

    try {

      await connection.query(sql1, [recipeId]);

      if (sql2 !== "none") {

        const [ updatedRecipeEquipment ] = await connection
        .query(sql2, recipeEquipment);
        
        await connection.commit();

        return updatedRecipeEquipment;

      } else {

        await connection.commit();

      }

    } catch (err) {

      await connection.rollback();

      throw err;

    } finally {

      connection.release();

    }
  }

  // TO DO: rename to deleteRecipeEquipmentByRecipeId
  async deleteRecipeEquipment(recipeId: number) {
    const sql = `
      DELETE
      FROM nobsc_recipe_equipment
      WHERE recipe_id = ?
    `;

    const [ deletedRecipeEquipment ] = await this.pool
    .execute(sql, [recipeId]);

    return deletedRecipeEquipment;
  }

  async deleteRecipeEquipmentByEquipmentId(equipmentId: number) {
    const sql = `
      DELETE
      FROM nobsc_recipe_equipment
      WHERE equipment_id = ?
    `;

    const [ deletedRecipeEquipment ] = await this.pool
    .execute(sql, [equipmentId]);

    return deletedRecipeEquipment;
  }
}