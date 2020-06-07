import { Pool, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class RecipeIngredient implements IRecipeIngredient {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewRecipeIngredientsByRecipeId =
      this.viewRecipeIngredientsByRecipeId.bind(this);
    this.createRecipeIngredients = this.createRecipeIngredients.bind(this);
    this.updateRecipeIngredients = this.updateRecipeIngredients.bind(this);
    this.deleteRecipeIngredients = this.deleteRecipeIngredients.bind(this);
    this.deleteRecipeIngredientsByIngredientId =
      this.deleteRecipeIngredientsByIngredientId.bind(this);
  }

  async viewRecipeIngredientsByRecipeId(recipeId: number) {
    const sql = `
      SELECT ri.amount, m.measurement_name, i.ingredient_name
      FROM nobsc_recipe_ingredients ri
      INNER JOIN nobsc_measurements m ON m.measurement_id = ri.measurement_id
      INNER JOIN nobsc_ingredients i ON i.ingredient_id = ri.ingredient_id
      WHERE ri.recipe_id = ?
      ORDER BY i.ingredient_type_id
    `;

    const [ recipeIngredients ] = await this.pool
    .execute<RowDataPacket[]>(sql, [recipeId]);
    
    return recipeIngredients;
  }

  async createRecipeIngredients(
    recipeIngredients: number[],
    recipeIngredientsPlaceholders: string
  ) {
    const sql = `
      INSERT INTO nobsc_recipe_ingredients
      (recipe_id, ingredient_id, amount, measurement_id)
      VALUES ${recipeIngredientsPlaceholders}
    `;

    const [ createdRecipeIngredients ] = await this.pool
    .execute<RowDataPacket[]>(sql, recipeIngredients);

    return createdRecipeIngredients;
  }

  // finish
  async updateRecipeIngredients(
    recipeIngredients: number[],
    recipeIngredientsPlaceholders: string,
    recipeId: number
  ) {
    const sql1 = `
      DELETE
      FROM nobsc_recipe_ingredients
      WHERE recipe_id = ?
    `;

    const sql2 = (recipeIngredients.length)
    ? `
      INSERT INTO nobsc_recipe_ingredients
      (recipe_id, ingredient_id, amount, measurement_id)
      VALUES ${recipeIngredientsPlaceholders} 
    `
    : "none";

    const connection = await this.pool.getConnection();

    await connection.beginTransaction();

    try {

      await connection.query(sql1, [recipeId]);

      if (sql2 !== "none") {

        const [ updatedRecipeIngredients ] = await connection
        .query(sql2, recipeIngredients);

        await connection.commit();

        return updatedRecipeIngredients;

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

  async deleteRecipeIngredients(recipeId: number) {
    const sql = `
      DELETE
      FROM nobsc_recipe_ingredients
      WHERE recipe_id = ?
    `;

    const [ deletedRecipeIngredients ] = await this.pool
    .execute<RowDataPacket[]>(sql, [recipeId]);

    return deletedRecipeIngredients;
  }

  async deleteRecipeIngredientsByIngredientId(ingredientId: number) {
    const sql = `
      DELETE
      FROM nobsc_recipe_ingredients
      WHERE ingredient_id = ?
    `;

    const [ deletedRecipeIngredients ] = await this.pool
    .execute<RowDataPacket[]>(sql, [ingredientId]);

    return deletedRecipeIngredients;
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
  viewRecipeIngredientsByRecipeId(recipeId: number): Data;
  createRecipeIngredients(
    recipeIngredients: number[],
    recipeIngredientsPlaceholders: string
  ): Data;
  updateRecipeIngredients(
    recipeIngredients: number[],
    recipeIngredientsPlaceholders: string,
    recipeId: number
  ): DataWithExtra;  // | finish
  deleteRecipeIngredients(recipeId: number): Data;
  deleteRecipeIngredientsByIngredientId(ingredientId: number): Data;
}

export interface IMakeRecipeIngredient {
  ingredient: number;
  amount: number;
  unit: number;
}