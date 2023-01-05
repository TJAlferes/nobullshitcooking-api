import { OkPacket, Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class RecipeMethod implements IRecipeMethod {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByRecipeId =    this.viewByRecipeId.bind(this);
    this.create =            this.create.bind(this);
    this.update =            this.update.bind(this);
    this.deleteByRecipeId =  this.deleteByRecipeId.bind(this);
    this.deleteByRecipeIds = this.deleteByRecipeIds.bind(this);
  }

  async viewByRecipeId(recipeId: number) {
    const sql = `
      SELECT m.name AS method_name
      FROM recipe_methods rm
      INNER JOIN methods m ON m.id = rm.method_id
      WHERE rm.recipe_id = ?
      ORDER BY m.id
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async create(placeholders: string, recipeMethods: number[]) {
    const sql = `INSERT INTO recipe_methods (recipe_id, method_id) VALUES ${placeholders}`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, recipeMethods);
    return rows;
  }
  
  async update(recipeId: number, placeholders: string, recipeMethods: number[]) {
    const sql1 = `DELETE FROM recipe_methods WHERE recipe_id = ?`;
    const sql2 = (recipeMethods.length) ? `INSERT INTO recipe_methods (recipe_id, method_id) VALUES ${placeholders}` : "none";
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();
    try {
      // Rather than updating current values in the database, we delete them,
      // and, if there are new values, we insert them.
      await conn.query(sql1, [recipeId]);
      if (sql2 !== "none") {
        const [ rows ] = await conn.query(sql2, recipeMethods);
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

  async deleteByRecipeId(recipeId: number) {
    const sql = `DELETE FROM recipe_methods WHERE recipe_id = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipeId]);
    return rows;
  }

  async deleteByRecipeIds(recipeIds: number[]) {
    const sql = `DELETE FROM recipe_methods WHERE recipe_id = ANY(?)`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, recipeIds);
    return rows;
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithExtra = Promise<RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader | undefined>;

export interface IRecipeMethod {
  pool:                                                                    Pool;
  viewByRecipeId(recipeId: number):                                        Data;
  create(placeholders: string, recipeMethods: number[]):                   Data;
  update(recipeId: number, placeholders: string, recipeMethods: number[]): DataWithExtra;  // | finish
  deleteByRecipeId(recipeId: number):                                      Data;
  deleteByRecipeIds(recipeIds: number[]):                                  Data;
}

export interface IMakeRecipeMethod {
  methodId: number;
}