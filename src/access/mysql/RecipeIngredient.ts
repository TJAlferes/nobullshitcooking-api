import { Pool, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class RecipeIngredient implements IRecipeIngredient {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByRecipeId = this.viewByRecipeId.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deleteByRecipeIds = this.deleteByRecipeIds.bind(this);
    this.deleteByRecipeId = this.deleteByRecipeId.bind(this);
    this.deleteByIngredientId = this.deleteByIngredientId.bind(this);
  }

  async viewByRecipeId(recipeId: number) {
    const sql = `
      SELECT ri.amount, m.name AS measurement_name, i.name AS ingredient_name
      FROM recipe_ingredients ri
      INNER JOIN measurements m ON m.id = ri.measurement_id
      INNER JOIN ingredients i ON i.id = ri.ingredient_id
      WHERE ri.recipe_id = ?
      ORDER BY i.ingredient_type_id
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async create(recipeIngredients: number[], placeholders: string) {
    const sql = `
      INSERT INTO recipe_ingredients
      (recipe_id, ingredient_id, amount, measurement_id)
      VALUES ${placeholders}
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, recipeIngredients);
    return row;
  }

  // finish
  async update(
    recipeIngredients: number[],
    placeholders: string,
    recipeId: number
  ) {
    const sql1 = `DELETE FROM recipe_ingredients WHERE recipe_id = ?`;
    const sql2 = (recipeIngredients.length)
    ? `
      INSERT INTO recipe_ingredients
      (recipe_id, ingredient_id, amount, measurement_id)
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

  async deleteByIngredientId(ingredientId: number) {
    const sql = `DELETE FROM recipe_ingredients WHERE ingredient_id = ?`;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, [ingredientId]);
    return rows;
  }

  async deleteByRecipeId(recipeId: number) {
    const sql = `DELETE FROM recipe_ingredients WHERE recipe_id = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async deleteByRecipeIds(recipeIds: number[]) {
    const sql = `DELETE FROM recipe_ingredients WHERE recipe_id = ANY(?)`;
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
  viewByRecipeId(recipeId: number): Data;
  create(recipeIngredients: number[], placeholders: string): Data;
  update(
    recipeIngredients: number[],
    placeholders: string,
    recipeId: number
  ): DataWithExtra;  // | finish
  deleteByIngredientId(ingredientId: number): Data;
  deleteByRecipeId(recipeId: number): Data;
  deleteByRecipeIds(recipeIds: number[]): Data;
}

export interface IMakeRecipeIngredient {
  ingredient: number;
  amount: number;
  unit: number;
}