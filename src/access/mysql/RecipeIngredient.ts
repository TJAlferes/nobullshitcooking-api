import { OkPacket, Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

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

  async create(placeholders: string, recipeIngredients: number[]) {
    const sql = `
      INSERT INTO recipe_ingredients
      (recipe_id, amount, measurement_id, ingredient_id)
      VALUES ${placeholders}
    `;
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql, recipeIngredients);
    return row;
  }
  
  async update(
    recipeId: number,
    placeholders: string,
    recipeIngredients: number[]
  ) {
    const sql1 = `DELETE FROM recipe_ingredients WHERE recipe_id = ?`;
    const sql2 = (recipeIngredients.length)
      ? `
        INSERT INTO recipe_ingredients
        (recipe_id, amount, measurement_id, ingredient_id)
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
        const [ rows ] = await conn.query(sql2, recipeIngredients);
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

  async deleteByIngredientId(ingredientId: number) {
    const sql = `DELETE FROM recipe_ingredients WHERE ingredient_id = ?`;
    const [ rows ] =
      await this.pool.execute<RowDataPacket[]>(sql, [ingredientId]);
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
  create(placeholders: string, recipeIngredients: number[]): Data;
  update(
    recipeId: number,
    placeholders: string,
    recipeIngredients: number[]
  ): DataWithExtra;  // | finish
  deleteByIngredientId(ingredientId: number): Data;
  deleteByRecipeId(recipeId: number): Data;
  deleteByRecipeIds(recipeIds: number[]): Data;
}

export interface IMakeRecipeIngredient {
  amount: number;
  ingredientId: number;
  measurementId: number;
}