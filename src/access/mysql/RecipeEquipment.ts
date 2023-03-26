import { OkPacket, Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class RecipeEquipment implements IRecipeEquipment {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByRecipeId =      this.viewByRecipeId.bind(this);
    this.create =              this.create.bind(this);
    this.update =              this.update.bind(this);
    this.deleteByEquipmentId = this.deleteByEquipmentId.bind(this);
    this.deleteByRecipeId =    this.deleteByRecipeId.bind(this);
    this.deleteByRecipeIds =   this.deleteByRecipeIds.bind(this);
  }

  async viewByRecipeId(id: number) {
    const sql = `
      SELECT re.amount, e.name AS equipment_name
      FROM recipe_equipment re
      INNER JOIN equipment e ON e.id = re.equipment_id
      WHERE re.recipe_id = ?
      ORDER BY e.equipment_type_id
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return rows;
  }

  async create(placeholders: string, recipeEquipment: number[]) {
    const sql = `INSERT INTO recipe_equipment (recipe_id, amount, equipment_id) VALUES ${placeholders}`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, recipeEquipment);
    return row;
  }

  async update(recipeId: number, placeholders: string, recipeEquipment: number[]) {
    const sql1 = `DELETE FROM recipe_equipment WHERE recipe_id = ?`;
    const sql2 = (recipeEquipment.length) ? `INSERT INTO recipe_equipment (recipe_id, amount, equipment_id) VALUES ${placeholders}` : "none";
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();

    try {
      // Rather than updating current values in the database, we delete them, and, if there are new values, we insert them.
      await conn.query(sql1, [recipeId]);
      if (sql2 !== "none") {
        const [ row ] = await conn.query(sql2, recipeEquipment);
        await conn.commit();
        return row;
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async deleteByEquipmentId(id: number) {
    const sql = `DELETE FROM recipe_equipment WHERE equipment_id = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return rows;
  }

  async deleteByRecipeId(id: number) {
    const sql = `DELETE FROM recipe_equipment WHERE recipe_id = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return rows;
  }

  async deleteByRecipeIds(ids: number[]) {
    const sql = `DELETE FROM recipe_equipment WHERE recipe_id = ANY(?)`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, ids);
    return rows;
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithExtra = Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader | undefined>;

export interface IRecipeEquipment {
  pool:                                                                      Pool;
  viewByRecipeId(id: number):                                                Data;
  create(placeholders: string, recipeEquipment: number[]):                   Data;
  update(recipeId: number, placeholders: string, recipeEquipment: number[]): DataWithExtra;  // | finish
  deleteByEquipmentId(id: number):                                           Data;
  deleteByRecipeId(id: number):                                              Data;
  deleteByRecipeIds(ids: number[]):                                          Data;
}

export interface IMakeRecipeEquipment {
  amount: number;
  id:     number;
}
