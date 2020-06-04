import { Pool, RowDataPacket } from 'mysql2/promise';

export class RecipeMethod implements IRecipeMethod {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewRecipeMethodsByRecipeId =
      this.viewRecipeMethodsByRecipeId.bind(this);
    this.createRecipeMethods = this.createRecipeMethods.bind(this);
    this.updateRecipeMethods = this.updateRecipeMethods.bind(this);
    this.deleteRecipeMethods = this.deleteRecipeMethods.bind(this);
  }

  async viewRecipeMethodsByRecipeId(recipeId: number) {
    const sql = `
      SELECT m.method_name
      FROM nobsc_recipe_methods rm
      INNER JOIN nobsc_methods m ON m.method_id = rm.method_id
      WHERE rm.recipe_id = ?
      ORDER BY m.method_id
    `;

    const [ recipeMethods ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);

    return recipeMethods;
  }

  async createRecipeMethods(
    recipeMethods: number[],
    recipeMethodsPlaceholders: string
  ) {
    const sql = `
      INSERT INTO nobsc_recipe_methods (recipe_id, method_id)
      VALUES ${recipeMethodsPlaceholders} 
    `;

    const [ createdRecipeMethods ] = await this.pool
    .execute<RowDataPacket[]>(sql, recipeMethods);

    return createdRecipeMethods;
  }

  // finish
  async updateRecipeMethods(
    recipeMethods: number[],
    recipeMethodsPlaceholders: string,
    recipeId: number
  ) {
    const sql1 = `
      DELETE
      FROM nobsc_recipe_methods
      WHERE recipe_id = ?
    `;

    const sql2 = (recipeMethods.length)
    ? `
      INSERT INTO nobsc_recipe_methods (recipe_id, method_id)
      VALUES ${recipeMethodsPlaceholders} 
    `
    : "none";

    const connection = await this.pool.getConnection();

    await connection.beginTransaction();

    try {

      await connection.query(sql1, [recipeId]);

      if (sql2 !== "none") {

        const [ updatedRecipeMethods ] = await connection
        .query(sql2, recipeMethods);

        await connection.commit();
        
        return updatedRecipeMethods;

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

  async deleteRecipeMethods(recipeId: number) {
    const sql = `
      DELETE
      FROM nobsc_recipe_methods
      WHERE recipe_id = ?
    `;

    const [ deletedRecipeMethods ] = await this.pool
    .execute<RowDataPacket[]>(sql, [recipeId]);

    return deletedRecipeMethods;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IRecipeMethod {
  pool: Pool;
  viewRecipeMethodsByRecipeId(recipeId: number): Data;
  createRecipeMethods(
    recipeMethods: number[],
    recipeMethodsPlaceholders: string
  ): Data;
  updateRecipeMethods(
    recipeMethods: number[],
    recipeMethodsPlaceholders: string,
    recipeId: number
  ): Data;  // | finish
  deleteRecipeMethods(recipeId: number): Data;
}

export interface IMakeRecipeMethod {
  methodId: number;
}