import { Pool, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class RecipeSubrecipe implements IRecipeSubrecipe {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByRecipeId = this.viewByRecipeId.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deleteByRecipeId = this.deleteByRecipeId.bind(this);
    this.deleteByRecipeIds = this.deleteByRecipeIds.bind(this);
    this.deleteBySubrecipeId = this.deleteBySubrecipeId.bind(this);
    this.deleteBySubrecipeIds = this.deleteBySubrecipeIds.bind(this);
  }

  async viewByRecipeId(recipeId: string) {
    const sql = `
      SELECT rs.amount, rs.measurement, r.title
      FROM recipe_subrecipes rs
      INNER JOIN recipes r ON r.id = rs.subrecipeId
      WHERE rs.recipeId = ?
      ORDER BY r.type
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async create(recipeSubrecipes: string[], placeholders: string) {
    const sql = `
      INSERT INTO recipe_subrecipes
      (recipeId, subrecipeId, amount, measurement)
      VALUES ${placeholders}
    `;
    const [ rows ] =
      await this.pool.execute<RowDataPacket[]>(sql, recipeSubrecipes);
    return rows;
  }

  // finish
  async update(
    recipeSubrecipes: string[],
    placeholders: string,
    recipeId: string
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
      await connection.query(sql1, [recipeId]);

      if (sql2 !== "none") {
        const [ rows ] = await connection.query(sql2, recipeSubrecipes);
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
    const sql = `DELETE FROM recipe_subrecipes WHERE recipeId = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async deleteByRecipeIds(recipeIds: string[]) {
    const sql = `DELETE FROM recipe_subrecipes WHERE recipeId = ANY(?)`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, recipeIds);
    return rows;
  }

  async deleteBySubrecipeId(subrecipeId: string) {
    const sql = `DELETE FROM recipe_subrecipes WHERE subrecipeId = ?`;
    const [ rows ] =
      await this.pool.execute<RowDataPacket[]>(sql, [subrecipeId]);
    return rows;
  }

  async deleteBySubrecipeIds(subrecipeIds: string[]) {
    const sql = `DELETE FROM recipe_subrecipes WHERE subrecipeId = ANY(?)`;
    const [ rows ] =
      await this.pool.execute<RowDataPacket[]>(sql, subrecipeIds);
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
  viewByRecipeId(recipeId: string): Data;
  create(recipeSubrecipes: (string|number)[], placeholders: string): Data;
  update(
    recipeSubrecipes: (string|number)[],
    placeholders: string,
    recipeId: string
  ): DataWithExtra;  // | finish
  deleteByRecipeId(recipeId: string): Data;
  deleteByRecipeIds(recipeIds: string[]): Data;
  deleteBySubrecipeId(subrecipeId: string): Data;
  deleteBySubrecipeIds(subrecipeIds: string[]): Data;
}

export interface IMakeRecipeSubrecipe {
  subrecipeId: string;
  amount: number;
  measurement: string;
}