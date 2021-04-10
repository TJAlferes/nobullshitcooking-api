import { Pool, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class RecipeMethod implements IRecipeMethod {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByRecipeId = this.viewByRecipeId.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deleteByRecipeId = this.deleteByRecipeId.bind(this);
    this.deleteByRecipeIds = this.deleteByRecipeIds.bind(this);
  }

  async viewByRecipeId(recipeId: string) {
    const sql = `
      SELECT method FROM recipe_methods rm WHERE rm.recipe = ? ORDER BY method
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async create(recipeMethods: string[], placeholders: string) {
    const sql = `
      INSERT INTO recipe_methods (recipeId, method) VALUES ${placeholders} 
    `;
    const [ rows ] =
      await this.pool.execute<RowDataPacket[]>(sql, recipeMethods);
    return rows;
  }

  // finish
  async update(
    recipeMethods: string[],
    placeholders: string,
    recipeId: string
  ) {
    const sql1 = `DELETE FROM recipe_methods WHERE recipe = ?`;
    const sql2 = (recipeMethods.length)
    ? `INSERT INTO recipe_methods (recipe, method) VALUES ${placeholders}`
    : "none";
    const connection = await this.pool.getConnection();

    await connection.beginTransaction();

    try {
      await connection.query(sql1, [recipeId]);

      if (sql2 !== "none") {
        const [ rows ] = await connection.query(sql2, recipeMethods);
        await connection.commit();
        return rows;
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

  async deleteByRecipeId(recipeId: string) {
    const sql = `DELETE FROM recipe_methods WHERE recipeId = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async deleteByRecipeIds(recipeIds: string[]) {
    const sql = `DELETE FROM recipe_methods WHERE recipeId = ANY(?)`;
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

export interface IRecipeMethod {
  pool: Pool;
  viewByRecipeId(recipeId: string): Data;
  create(recipeMethods: string[], placeholders: string): Data;
  update(
    recipeMethods: string[],
    placeholders: string,
    recipeId: string
  ): DataWithExtra;  // | finish
  deleteByRecipeId(recipeId: string): Data;
  deleteByRecipeIds(recipeIds: string[]): Data;
}

export interface IMakeRecipeMethod {
  method: string;
}