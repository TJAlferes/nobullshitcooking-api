import { Pool, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class RecipeMethod implements IRecipeMethod {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByRecipe = this.viewByRecipe.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deleteByRecipe = this.deleteByRecipe.bind(this);
    this.deleteByRecipes = this.deleteByRecipes.bind(this);
  }

  async viewByRecipe(recipe: string) {
    const sql = `
      SELECT method FROM recipe_methods rm WHERE rm.recipe = ? ORDER BY method
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipe]);
    return rows;
  }

  async create(recipeMethods: string[], placeholders: string) {
    const sql = `
      INSERT INTO recipe_methods (recipe, method) VALUES ${placeholders} 
    `;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, recipeMethods);
    return rows;
  }

  // finish
  async update(
    recipeMethods: string[],
    placeholders: string,
    recipe: string
  ) {
    const sql1 = `DELETE FROM recipe_methods WHERE recipe = ?`;
    const sql2 = (recipeMethods.length)
    ? `INSERT INTO recipe_methods (recipe, method) VALUES ${placeholders}`
    : "none";
    const connection = await this.pool.getConnection();

    await connection.beginTransaction();

    try {
      await connection.query(sql1, [recipe]);

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

  async deleteByRecipe(recipe: string) {
    const sql = `DELETE FROM recipe_methods WHERE recipe = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipe]);
    return rows;
  }

  async deleteByRecipes(recipes: string[]) {
    const sql = `DELETE FROM recipe_methods WHERE recipe = ANY(?)`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, recipes);
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
  viewByRecipe(recipe: string): Data;
  create(recipeMethods: string[], placeholders: string): Data;
  update(
    recipeMethods: string[],
    placeholders: string,
    recipe: string
  ): DataWithExtra;  // | finish
  deleteByRecipe(recipe: string): Data;
  deleteByRecipes(recipes: string[]): Data;
}

export interface IMakeRecipeMethod {
  method: string;
}