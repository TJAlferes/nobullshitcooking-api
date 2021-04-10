import { Pool, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class RecipeIngredient implements IRecipeIngredient {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByRecipeId = this.viewByRecipeId.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deleteByIngredientId = this.deleteByIngredientId.bind(this);
    this.deleteByRecipeId = this.deleteByRecipeId.bind(this);
    this.deleteByRecipeIds = this.deleteByRecipeIds.bind(this);
  }

  async viewByRecipeId(recipeId: string) {
    const sql = `
      SELECT ri.amount, ri.measurement, i.name AS ingredient
      FROM recipe_ingredients ri
      INNER JOIN ingredients i ON i.id = ri.ingredientId
      WHERE ri.recipeId = ?
      ORDER BY i.type
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async create(recipeIngredients: string[], placeholders: string) {
    const sql = `
      INSERT INTO recipe_ingredients
      (recipeId, ingredientId, amount, measurement)
      VALUES ${placeholders}
    `;
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql, recipeIngredients);
    return row;
  }

  // finish
  async update(
    recipeIngredients: string[],
    placeholders: string,
    recipeId: string
  ) {
    const sql1 = `DELETE FROM recipe_ingredients WHERE recipe = ?`;
    const sql2 = (recipeIngredients.length)
      ? `
        INSERT INTO recipe_ingredients
        (recipeId, ingredientId, amount, measurement)
        VALUES ${placeholders} 
      `
      : "none";

    const connection = await this.pool.getConnection();

    await connection.beginTransaction();

    try {
      await connection.query(sql1, [recipeId]);

      if (sql2 !== "none") {
        const [ rows ] = await connection.query(sql2, recipeIngredients);
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

  async deleteByIngredientId(ingredientId: string) {
    const sql = `DELETE FROM recipe_ingredients WHERE ingredientId = ?`;
    const [ rows ] =
      await this.pool.execute<RowDataPacket[]>(sql, [ingredientId]);
    return rows;
  }

  async deleteByRecipeId(recipeId: string) {
    const sql = `DELETE FROM recipe_ingredients WHERE recipeId = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async deleteByRecipeIds(recipeIds: string[]) {
    const sql = `DELETE FROM recipe_ingredients WHERE recipeId = ANY(?)`;
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

export interface IRecipeIngredient {
  pool: Pool;
  viewByRecipeId(recipeId: string): Data;
  create(recipeIngredients: (string|number)[], placeholders: string): Data;
  update(
    recipeIngredients: (string|number)[],
    placeholders: string,
    recipeId: string
  ): DataWithExtra;  // | finish
  deleteByIngredientId(ingredientId: string): Data;
  deleteByRecipeId(recipeId: string): Data;
  deleteByRecipeIds(recipeIds: string[]): Data;
}

export interface IMakeRecipeIngredient {
  ingredientId: string;
  amount: number;
  measurement: string;
}