import { Pool, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class RecipeSubrecipe implements IRecipeSubrecipe {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByRecipe = this.viewByRecipe.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deleteByRecipe = this.deleteByRecipe.bind(this);
    this.deleteByRecipes = this.deleteByRecipes.bind(this);
    this.deleteBySubrecipe = this.deleteBySubrecipe.bind(this);
    this.deleteBySubrecipes = this.deleteBySubrecipes.bind(this);
  }

  async viewByRecipe(recipe: string) {
    const sql = `
      SELECT rs.amount, rs.measurement, r.title
      FROM recipe_subrecipes rs
      INNER JOIN recipes r ON r.id = rs.subrecipe
      WHERE rs.recipe = ?
      ORDER BY r.type
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipe]);
    return rows;
  }

  async create(recipeSubrecipes: string[], placeholders: string) {
    const sql = `
      INSERT INTO recipe_subrecipes
      (recipe, subrecipe, amount, measurement)
      VALUES ${placeholders}
    `;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, recipeSubrecipes);
    return rows;
  }

  // finish
  async update(
    recipeSubrecipes: string[],
    placeholders: string,
    recipe: string
  ) {
    const sql1 = `DELETE FROM recipe_subrecipes WHERE recipe = ?`;
    const sql2 = (recipeSubrecipes.length)
    ? `
      INSERT INTO recipe_subrecipes
      (recipe, subrecipe, amount, measurement)
      VALUES ${placeholders}
    `
    : "none";
    const connection = await this.pool.getConnection();

    await connection.beginTransaction();

    try {
      await connection.query(sql1, [recipe]);

      if (sql2 !== "none") {
        const [ rows ] = await connection
        .query(sql2, recipeSubrecipes);
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
    const sql = `DELETE FROM recipe_subrecipes WHERE recipe = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipe]);
    return rows;
  }

  async deleteByRecipes(recipes: string[]) {
    const sql = `DELETE FROM recipe_subrecipes WHERE recipe = ANY(?)`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, recipes);
    return rows;
  }

  async deleteBySubrecipe(subrecipe: string) {
    const sql = `DELETE FROM recipe_subrecipes WHERE subrecipe = ?`;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, [subrecipe]);
    return rows;
  }

  async deleteBySubrecipes(subrecipes: string[]) {
    const sql = `DELETE FROM recipe_subrecipes WHERE subrecipe = ANY(?)`;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, subrecipes);
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
  viewByRecipe(recipe: string): Data;
  create(recipeSubrecipes: (string|number)[], placeholders: string): Data;
  update(
    recipeSubrecipes: (string|number)[],
    placeholders: string,
    recipe: string
  ): DataWithExtra;  // | finish
  deleteByRecipe(recipe: string): Data;
  deleteByRecipes(recipes: string[]): Data;
  deleteBySubrecipe(subrecipe: string): Data;
  deleteBySubrecipes(subrecipes: string[]): Data;
}

export interface IMakeRecipeSubrecipe {
  subrecipe: string;
  amount: number;
  unit: string;
}