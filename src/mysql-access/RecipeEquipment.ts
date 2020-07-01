import { Pool, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class RecipeEquipment implements IRecipeEquipment {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewRecipeEquipmentByRecipeId =
      this.viewRecipeEquipmentByRecipeId.bind(this);
    this.createRecipeEquipment = this.createRecipeEquipment.bind(this);
    this.updateRecipeEquipment = this.updateRecipeEquipment.bind(this);
    this.deleteRecipeEquipmentByRecipeIds =
      this.deleteRecipeEquipmentByRecipeIds.bind(this);
    this.deleteRecipeEquipment = this.deleteRecipeEquipment.bind(this);
    this.deleteRecipeEquipmentByEquipmentId =
      this.deleteRecipeEquipmentByEquipmentId.bind(this);
  }

  async viewRecipeEquipmentByRecipeId(recipeId: number) {
    const sql = `
      SELECT re.amount, e.equipment_name
      FROM nobsc_recipe_equipment re
      INNER JOIN nobsc_equipment e ON e.equipment_id = re.equipment_id
      WHERE re.recipe_id = ?
      ORDER BY e.equipment_type_id
    `;

    const [ recipeEquipment ] = await this.pool
    .execute<RowDataPacket[]>(sql, [recipeId]);

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
    .execute<RowDataPacket[]>(sql, recipeEquipment);

    return createdRecipeEquipment;
  }

  // finish
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

  async deleteRecipeEquipmentByRecipeIds(recipeIds: number[]) {
    const sql = `
      DELETE
      FROM nobsc_recipe_equipment
      WHERE recipe_id = ANY(?)
    `;

    const [ deletedRecipeEquipment ] = await this.pool
    .execute<RowDataPacket[]>(sql, recipeIds);

    return deletedRecipeEquipment;
  }

  // TO DO: rename to deleteRecipeEquipmentByRecipeId
  async deleteRecipeEquipment(recipeId: number) {
    const sql = `
      DELETE
      FROM nobsc_recipe_equipment
      WHERE recipe_id = ?
    `;

    const [ deletedRecipeEquipment ] = await this.pool
    .execute<RowDataPacket[]>(sql, [recipeId]);

    return deletedRecipeEquipment;
  }

  async deleteRecipeEquipmentByEquipmentId(equipmentId: number) {
    const sql = `
      DELETE
      FROM nobsc_recipe_equipment
      WHERE equipment_id = ?
    `;

    const [ deletedRecipeEquipment ] = await this.pool
    .execute<RowDataPacket[]>(sql, [equipmentId]);

    return deletedRecipeEquipment;
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithExtra = Promise<
  RowDataPacket[] |
  RowDataPacket[][] |
  OkPacket |
  OkPacket[] |
  ResultSetHeader |
  undefined
>;

export interface IRecipeEquipment {
  pool: Pool;
  viewRecipeEquipmentByRecipeId(recipeId: number): Data;
  createRecipeEquipment(
    recipeEquipment: number[],
    recipeEquipmentPlaceholders: string
  ): Data;
  updateRecipeEquipment(
    recipeEquipment: number[],
    recipeEquipmentPlaceholders: string,
    recipeId: number
  ): DataWithExtra;  // | finish
  deleteRecipeEquipmentByRecipeIds(recipeIds: number[]): Data;
  deleteRecipeEquipment(recipeId: number): Data;
  deleteRecipeEquipmentByEquipmentId(equipmentId: number): Data;
}

export interface IMakeRecipeEquipment {
  equipment: number;
  amount: number;
}