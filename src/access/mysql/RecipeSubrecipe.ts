import { OkPacket, Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class RecipeSubrecipe implements IRecipeSubrecipe {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByRecipeId = this.viewByRecipeId.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deleteByRecipeId = this.deleteByRecipeId.bind(this);
    this.deleteByRecipeIds = this.deleteByRecipeIds.bind(this);
    this.deleteBySubrecipeId = this.deleteBySubrecipeId.bind(this);
    this.deleteBySubrecipeIds = this.deleteBySubrecipeIds.bind(this);
  }

  async viewByRecipeId(recipeId: number) {
    const sql = `
      SELECT rs.amount, m.name AS measurement_name, r.title
      FROM recipe_subrecipes rs
      INNER JOIN measurements m ON m.id = rs.measurement_id
      INNER JOIN recipes r ON r.id = rs.subrecipe_id
      WHERE rs.recipe_id = ?
      ORDER BY r.recipe_type_id
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async create(placeholders: string, recipeSubrecipes: number[]) {
    const sql = `
      INSERT INTO recipe_subrecipes
      (recipe_id, amount, measurement_id, subrecipe_id)
      VALUES ${placeholders}
    `;
    const [ rows ] =
      await this.pool.execute<RowDataPacket[]>(sql, recipeSubrecipes);
    return rows;
  }
  
  async update(
    recipeId: number,
    placeholders: string,
    recipeSubrecipes: number[]
  ) {
    const sql1 = `DELETE FROM recipe_subrecipes WHERE recipe_id = ?`;
    const sql2 = (recipeSubrecipes.length)
      ? `
        INSERT INTO recipe_subrecipes
        (recipe_id, amount, measurement_id, subrecipe_id)
        VALUES ${placeholders} 
      `
      : "none";
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();
    try {
      // Rather than updating current values in the database, we delete them,
      // and, if there are new values, we insert them.
      await conn.query(sql1, [recipeId]);
      if (sql2 !== "none") {
        const [ rows ] = await conn
        .query(sql2, recipeSubrecipes);
        await conn.commit();
        return rows;
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async deleteByRecipeId(recipeId: number) {
    const sql = `DELETE FROM recipe_subrecipes WHERE recipe_id = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async deleteByRecipeIds(recipeIds: number[]) {
    const sql = `DELETE FROM recipe_subrecipes WHERE recipe_id = ANY(?)`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, recipeIds);
    return rows;
  }

  async deleteBySubrecipeId(subrecipeId: number) {
    const sql = `DELETE FROM recipe_subrecipes WHERE subrecipe_id = ?`;
    const [ rows ] =
      await this.pool.execute<RowDataPacket[]>(sql, [subrecipeId]);
    return rows;
  }

  async deleteBySubrecipeIds(subrecipeIds: number[]) {
    const sql = `DELETE FROM recipe_subrecipes WHERE subrecipe_id = ANY(?)`;
    const [ rows ] =
      await this.pool.execute<RowDataPacket[]>(sql, subrecipeIds);
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

export interface IRecipeSubrecipe {
  pool: Pool;
  viewByRecipeId(recipeId: number): Data;
  create(placeholders: string, recipeSubrecipes: number[]): Data;
  update(
    recipeId: number,
    placeholders: string,
    recipeSubrecipes: number[]
  ): DataWithExtra;  // | finish
  deleteByRecipeId(recipeId: number): Data;
  deleteByRecipeIds(recipeIds: number[]): Data;
  deleteBySubrecipeId(subrecipeId: number): Data;
  deleteBySubrecipeIds(subrecipeIds: number[]): Data;
}

export interface IMakeRecipeSubrecipe {
  amount: number;
  measurementId: number;
  subrecipeId: number;
}