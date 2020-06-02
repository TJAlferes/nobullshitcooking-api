import { Pool, RowDataPacket } from 'mysql2/promise';

export interface IRecipeSubrecipe {
  subrecipe: number
  amount: number
  unit: number
}

export class RecipeSubrecipe {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewRecipeSubrecipesByRecipeId = this.viewRecipeSubrecipesByRecipeId.bind(this);
    this.createRecipeSubrecipes = this.createRecipeSubrecipes.bind(this);
    this.updateRecipeSubrecipes = this.updateRecipeSubrecipes.bind(this);
    this.deleteRecipeSubrecipes = this.deleteRecipeSubrecipes.bind(this);
    this.deleteRecipeSubrecipesBySubrecipeId = this.deleteRecipeSubrecipesBySubrecipeId.bind(this);
  }

  async viewRecipeSubrecipesByRecipeId(recipeId: number) {
    const sql = `
      SELECT rs.amount, m.measurement_name, r.title
      FROM nobsc_recipe_subrecipes rs
      INNER JOIN nobsc_measurements m ON m.measurement_id = rs.measurement_id
      INNER JOIN nobsc_recipes r ON r.recipe_id = rs.subrecipe_id
      WHERE rs.recipe_id = ?
      ORDER BY r.recipe_type_id
    `;

    const [ recipeSubrecipes ] = await this.pool.execute(sql, [recipeId]);

    return recipeSubrecipes;
  }

  async createRecipeSubrecipes(
    recipeSubrecipes: number[],
    recipeSubrecipesPlaceholders: string
  ) {
    const sql = `
      INSERT INTO nobsc_recipe_subrecipes
      (recipe_id, subrecipe_id, amount, measurement_id)
      VALUES ${recipeSubrecipesPlaceholders}
    `;

    const [ createdRecipeSubrecipes ] = await this.pool
    .execute(sql, recipeSubrecipes);

    return createdRecipeSubrecipes;
  }

  async updateRecipeSubrecipes(
    recipeSubrecipes: number[],
    recipeSubrecipesPlaceholders: string,
    recipeId: number
  ) {
    const sql1 = `
      DELETE
      FROM nobsc_recipe_subrecipes
      WHERE recipe_id = ?
    `;

    const sql2 = (recipeSubrecipes.length)
    ? `
      INSERT INTO nobsc_recipe_subrecipes
      (recipe_id, subrecipe_id, amount, measurement_id)
      VALUES ${recipeSubrecipesPlaceholders} 
    `
    : "none";

    const connection = await this.pool.getConnection();

    await connection.beginTransaction();

    try {

      await connection.query(sql1, [recipeId]);

      if (sql2 !== "none") {

        const [ updatedRecipeSubrecipes ] = await connection
        .query(sql2, recipeSubrecipes);

        await connection.commit();

        return updatedRecipeSubrecipes;

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

  async deleteRecipeSubrecipes(recipeId: number) {
    const sql = `
      DELETE
      FROM nobsc_recipe_subrecipes
      WHERE recipe_id = ?
    `;

    /*const sql2 = `
      DELETE
      FROM nobsc_recipe_subrecipes
      WHERE subrecipe_id = ?
    `;*/

    const [ deletedRecipeSubrecipes ] = await this.pool
    .execute(sql, [recipeId]);

    //await this.pool.execute(sql2, [recipeId]);

    return deletedRecipeSubrecipes;
  }

  async deleteRecipeSubrecipesBySubrecipeId(subrecipeId: number) {
    const sql = `
      DELETE
      FROM nobsc_recipe_subrecipes
      WHERE subrecipe_id = ?
    `;

    const [ deletedRecipeSubrecipes ] = await this.pool
    .execute(sql, [subrecipeId]);
    
    return deletedRecipeSubrecipes;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IRecipeSubrecipe {
  pool: Pool;
}