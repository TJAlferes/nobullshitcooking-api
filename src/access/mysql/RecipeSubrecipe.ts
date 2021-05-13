import { OkPacket, Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

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

  async viewByRecipeId(recipeId: number) {
    const sql = `
      SELECT rs.amount, m.name AS measurement_name, r.title
      FROM recipe_subrecipes rs
      INNER JOIN measurements m ON m.id = rs.measurement_id
      INNER JOIN recipes r ON r.id = rs.subrecipe_id
      WHERE rs.recipe_id = ?
      ORDER BY r.recipe_type_id
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async create(recipeSubrecipes: number[], placeholders: string) {
    const sql = `
      INSERT INTO recipe_subrecipes
      (recipe_id, subrecipe_id, amount, measurement_id)
      VALUES ${placeholders}
    `;
    const [ rows ] =
      await this.pool.execute<RowDataPacket[]>(sql, recipeSubrecipes);
    return rows;
  }

  // TO DO: finish
  async update(
    recipeSubrecipes: number[],
    placeholders: string,
    recipeId: number
  ) {
    const sql1 = `DELETE FROM recipe_subrecipes WHERE recipe_id = ?`;
    const sql2 = (recipeSubrecipes.length)
      ? `
        INSERT INTO recipe_subrecipes
        (recipe_id, subrecipe_id, amount, measurement_id)
        VALUES ${placeholders} 
      `
      : "none";
    const connection = await this.pool.getConnection();

    await connection.beginTransaction();

    try {

      await connection.query(sql1, [recipeId]);

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

  async deleteByRecipeId(recipeId: number) {
    const sql = `DELETE FROM recipe_subrecipes WHERE recipe_id = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async deleteByRecipeIds(recipeIds: number[]) {
    const sql = `DELETE FROM recipe_subrecipes WHERE recipe_id = ANY(?)`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, recipeIds);
    return rows;
  }

  async deleteBySubrecipeId(subrecipeId: number) {
    const sql = `DELETE FROM recipe_subrecipes WHERE subrecipe_id = ?`;
    const [ rows ] =
      await this.pool.execute<RowDataPacket[]>(sql, [subrecipeId]);
    return rows;
  }

  async deleteBySubrecipeIds(subrecipeIds: number[]) {
    const sql = `DELETE FROM recipe_subrecipes WHERE subrecipe_id = ANY(?)`;
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
  viewByRecipeId(recipeId: number): Data;
  create(recipeSubrecipes: number[], placeholders: string): Data;
  update(
    recipeSubrecipes: number[],
    placeholders: string,
    recipeId: number
  ): DataWithExtra;  // | finish
  deleteByRecipeId(recipeId: number): Data;
  deleteByRecipeIds(recipeIds: number[]): Data;
  deleteBySubrecipeId(subrecipeId: number): Data;
  deleteBySubrecipeIds(subrecipeIds: number[]): Data;
}

export interface IMakeRecipeSubrecipe {
  amount: number;
  measurementId: number;
  subrecipeId: number;
}