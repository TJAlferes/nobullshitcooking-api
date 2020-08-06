import { Pool, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class RecipeEquipment implements IRecipeEquipment {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByRecipeId = this.viewByRecipeId.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deleteByRecipeIds = this.deleteByRecipeIds.bind(this);
    this.deleteByRecipeId = this.deleteByRecipeId.bind(this);
    this.deleteByEquipmentId = this.deleteByEquipmentId.bind(this);
  }

  async viewByRecipeId(recipeId: number) {
    const sql = `
      SELECT re.amount, e.name AS equipment_name
      FROM recipe_equipment re
      INNER JOIN equipment e ON e.id = re.equipment_id
      WHERE re.recipe_id = ?
      ORDER BY e.equipment_type_id
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async create(recipeEquipment: number[], placeholders: string) {
    const sql = `
      INSERT INTO recipe_equipment (recipe_id, equipment_id, amount)
      VALUES ${placeholders} 
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, recipeEquipment);
    return row;
  }

  // finish
  async update(
    recipeEquipment: number[],
    placeholders: string,
    recipeId: number
  ) {
    const sql1 = `DELETE FROM recipe_equipment WHERE recipe_id = ?`;
    const sql2 = (recipeEquipment.length)
    ? `
      INSERT INTO recipe_equipment (recipe_id, equipment_id, amount)
      VALUES ${placeholders} 
    `
    : "none";
    const connection = await this.pool.getConnection();

    await connection.beginTransaction();

    try {
      await connection.query(sql1, [recipeId]);

      if (sql2 !== "none") {
        const [ row ] = await connection.query(sql2, recipeEquipment);
        await connection.commit();
        return row;
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

  async deleteByEquipmentId(equipmentId: number) {
    const sql = `DELETE FROM recipe_equipment WHERE equipment_id = ?`;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, [equipmentId]);
    return rows;
  }

  async deleteByRecipeId(recipeId: number) {
    const sql = `DELETE FROM recipe_equipment WHERE recipe_id = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async deleteByRecipeIds(recipeIds: number[]) {
    const sql = `DELETE FROM recipe_equipment WHERE recipe_id = ANY(?)`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, recipeIds);
    return rows;
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
  viewByRecipeId(recipeId: number): Data;
  create(recipeEquipment: number[], placeholders: string): Data;
  update(
    recipeEquipment: number[],
    placeholders: string,
    recipeId: number
  ): DataWithExtra;  // | finish
  deleteByEquipmentId(equipmentId: number): Data;
  deleteByRecipeId(recipeId: number): Data;
  deleteByRecipeIds(recipeIds: number[]): Data;
}

export interface IMakeRecipeEquipment {
  equipment: number;
  amount: number;
}