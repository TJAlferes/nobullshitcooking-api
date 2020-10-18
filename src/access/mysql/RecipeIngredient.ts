import { Pool, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class RecipeIngredient implements IRecipeIngredient {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByRecipe = this.viewByRecipe.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deleteByIngredient = this.deleteByIngredient.bind(this);
    this.deleteByRecipe = this.deleteByRecipe.bind(this);
    this.deleteByRecipes = this.deleteByRecipes.bind(this);
  }

  async viewByRecipe(recipe: string) {
    const sql = `
      SELECT ri.amount, ri.measurement, i.name AS ingredient
      FROM recipe_ingredients ri
      INNER JOIN ingredients i ON i.id = ri.ingredient
      WHERE ri.recipe = ?
      ORDER BY i.type
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipe]);
    return rows;
  }

  async create(recipeIngredients: string[], placeholders: string) {
    const sql = `
      INSERT INTO recipe_ingredients
      (recipe, ingredient, amount, measurement)
      VALUES ${placeholders}
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, recipeIngredients);
    return row;
  }

  // finish
  async update(
    recipeIngredients: string[],
    placeholders: string,
    recipe: string
  ) {
    const sql1 = `DELETE FROM recipe_ingredients WHERE recipe = ?`;
    const sql2 = (recipeIngredients.length)
    ? `
      INSERT INTO recipe_ingredients
      (recipe, ingredient, amount, measurement)
      VALUES ${placeholders} 
    `
    : "none";

    const connection = await this.pool.getConnection();

    await connection.beginTransaction();

    try {
      await connection.query(sql1, [recipe]);

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

  async deleteByIngredient(ingredient: string) {
    const sql = `DELETE FROM recipe_ingredients WHERE ingredient = ?`;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, [ingredient]);
    return rows;
  }

  async deleteByRecipe(recipe: string) {
    const sql = `DELETE FROM recipe_ingredients WHERE recipe = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipe]);
    return rows;
  }

  async deleteByRecipes(recipes: string[]) {
    const sql = `DELETE FROM recipe_ingredients WHERE recipe = ANY(?)`;
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

export interface IRecipeIngredient {
  pool: Pool;
  viewByRecipe(recipe: string): Data;
  create(recipeIngredients: string[], placeholders: string): Data;
  update(
    recipeIngredients: string[],
    placeholders: string,
    recipe: string
  ): DataWithExtra;  // | finish
  deleteByIngredient(ingredient: string): Data;
  deleteByRecipe(recipe: string): Data;
  deleteByRecipes(recipes: string[]): Data;
}

export interface IMakeRecipeIngredient {
  ingredient: string;
  amount: number;
  unit: string;
}