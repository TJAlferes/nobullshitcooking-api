import { Pool, RowDataPacket } from 'mysql2/promise';

export class RecipeMethodRepository implements IRecipeMethodRepository {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewByRecipeId(id: number) {
    const sql = `
      SELECT m.name AS method_name
      FROM recipe_methods rm
      INNER JOIN methods m ON m.id = rm.method_id
      WHERE rm.recipe_id = ?
      ORDER BY m.id
    `;
    const [ rows ] = await this.pool.execute<RecipeMethod[]>(sql, [id]);
    return rows;
  }

  async create(placeholders: string, recipeMethods: number[]) {
    const sql = `INSERT INTO recipe_methods (recipe_id, method_id) VALUES ${placeholders}`;
    await this.pool.execute(sql, recipeMethods);  // test that this works correctly!
  }
  
  async update(recipeId: number, placeholders: string, recipeMethods: number[]) {
    const sql1 = `DELETE FROM recipe_methods WHERE recipe_id = ?`;
    const sql2 = recipeMethods.length ? `INSERT INTO recipe_methods (recipe_id, method_id) VALUES ${placeholders}` : undefined;
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();
    try {
      // Rather than updating current values in the database, we delete them...
      await conn.query(sql1, [recipeId]);
      // ... and, if there are new values, we insert them.
      if (sql2) {
        await conn.query(sql2, recipeMethods);
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async deleteByRecipeId(id: number) {
    const sql = `DELETE FROM recipe_methods WHERE recipe_id = ?`;
    await this.pool.execute(sql, [id]);
  }

  async deleteByRecipeIds(ids: number[]) {
    const sql = `DELETE FROM recipe_methods WHERE recipe_id = ANY(?)`;
    await this.pool.execute(sql, ids);
  }
}

export interface IRecipeMethodRepository {
  pool:              Pool;
  viewByRecipeId:    (id: number) =>                                                      Promise<RecipeMethod[]>;
  create:            (placeholders: string, recipeMethods: number[]) =>                   Promise<void>;
  update:            (recipeId: number, placeholders: string, recipeMethods: number[]) => Promise<void>;
  deleteByRecipeId:  (id: number) =>                                                      Promise<void>;
  deleteByRecipeIds: (ids: number[]) =>                                                   Promise<void>;
}

export type MakeRecipeMethod = {
  id: number;
};

export type RecipeMethod = RowDataPacket & {
  method_name: string;
};
