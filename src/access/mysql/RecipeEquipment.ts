import { Pool, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class RecipeEquipment implements IRecipeEquipment {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByRecipeId = this.viewByRecipeId.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deleteByEquipmentId = this.deleteByEquipmentId.bind(this);
    this.deleteByRecipeId = this.deleteByRecipeId.bind(this);
    this.deleteByRecipeIds = this.deleteByRecipeIds.bind(this);
  }

  async viewByRecipeId(recipeId: string) {
    const sql = `
      SELECT re.amount, e.name AS equipment
      FROM recipe_equipment re
      INNER JOIN equipment e ON e.id = re.equipmentId
      WHERE re.recipeId = ?
      ORDER BY e.type
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async create(recipeEquipment: string[], placeholders: string) {
    const sql = `
      INSERT INTO recipe_equipment (recipeId, equipmentId, amount)
      VALUES ${placeholders} 
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, recipeEquipment);
    return row;
  }

  // finish
  async update(
    recipeEquipment: string[],
    placeholders: string,
    recipeId: string
  ) {
    const sql1 = `DELETE FROM recipe_equipment WHERE recipeId = ?`;
    const sql2 = (recipeEquipment.length)
    ? `
      INSERT INTO recipe_equipment (recipeId, equipmentId, amount)
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

  async deleteByEquipmentId(equipmentId: string) {
    const sql = `DELETE FROM recipe_equipment WHERE equipmentId = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [equipmentId]);
    return rows;
  }

  async deleteByRecipeId(recipeId: string) {
    const sql = `DELETE FROM recipe_equipment WHERE recipeId = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async deleteByRecipeIds(recipeIds: string[]) {
    const sql = `DELETE FROM recipe_equipment WHERE recipeId = ANY(?)`;
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
  viewByRecipeId(recipeId: string): Data;
  create(recipeEquipment: (string|number)[], placeholders: string): Data;
  update(
    recipeEquipment: (string|number)[],
    placeholders: string,
    recipeId: string
  ): DataWithExtra;  // | finish
  deleteByEquipmentId(equipmentId: string): Data;
  deleteByRecipeId(recipeId: string): Data;
  deleteByRecipeIds(recipeIds: string[]): Data;
}

export interface IMakeRecipeEquipment {
  equipmentId: string;
  amount: string;
}