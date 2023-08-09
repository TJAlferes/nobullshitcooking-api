import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from './MySQL';

export class RecipeSubrecipeRepo extends MySQLRepo implements IRecipeSubrecipeRepo {
  async viewByRecipeId(id: number) {
    const sql = `
      SELECT rs.amount, m.name AS measurement_name, r.title
      FROM recipe_subrecipe rs
      INNER JOIN measurement m ON m.id = rs.measurement_id
      INNER JOIN recipe r ON r.id = rs.subrecipe_id
      WHERE rs.recipe_id = ?
      ORDER BY r.recipe_type_id
    `;
    const [ rows ] = await this.pool.execute<RecipeSubrecipe[]>(sql, [id]);
    return rows;
  }

  async create(placeholders: string, recipeSubrecipes: number[]) {
    const sql = `INSERT INTO recipe_subrecipe (recipe_id, amount, measurement_id, subrecipe_id) VALUES ${placeholders}`;
    await this.pool.execute(sql, recipeSubrecipes);
  }
  
  async update(recipeId: number, placeholders: string, recipeSubrecipes: number[]) {
    const sql1 = `DELETE FROM recipe_subrecipe WHERE recipe_id = ?`;
    const sql2 = recipeSubrecipes.length ? `INSERT INTO recipe_subrecipe (recipe_id, amount, measurement_id, subrecipe_id) VALUES ${placeholders}` : undefined;
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();
    try {
      // Rather than updating current values in the database, we delete them...
      await conn.query(sql1, [recipeId]);
      // ... and, if there are new values, we insert them.
      if (sql2) {
        await conn.query(sql2, recipeSubrecipes);
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
    const sql = `DELETE FROM recipe_subrecipe WHERE recipe_id = ?`;
    await this.pool.execute(sql, [id]);
  }

  async deleteByRecipeIds(ids: number[]) {
    const sql = `DELETE FROM recipe_subrecipe WHERE recipe_id = ANY(?)`;
    await this.pool.execute(sql, ids);
  }

  async deleteBySubrecipeId(id: number) {
    const sql = `DELETE FROM recipe_subrecipe WHERE subrecipe_id = ?`;
    await this.pool.execute(sql, [id]);
  }

  async deleteBySubrecipeIds(ids: number[]) {
    const sql = `DELETE FROM recipe_subrecipe WHERE subrecipe_id = ANY(?)`;
    await this.pool.execute(sql, ids);
  }
}

export interface IRecipeSubrecipeRepo {
  viewByRecipeId:       (id: number) =>                                                         Promise<RecipeSubrecipe[]>;
  create:               (placeholders: string, recipeSubrecipes: number[]) =>                   Promise<void>;
  update:               (recipeId: number, placeholders: string, recipeSubrecipes: number[]) => Promise<void>;
  deleteBySubrecipeId:  (id: number) =>                                                         Promise<void>;
  deleteBySubrecipeIds: (ids: number[]) =>                                                      Promise<void>;
  deleteByRecipeId:     (id: number) =>                                                         Promise<void>;
  deleteByRecipeIds:    (ids: number[]) =>                                                      Promise<void>;
}

export type MakeRecipeSubrecipe = {
  amount:        number;
  measurementId: number;
  id:            number;
};

export type RecipeSubrecipe = RowDataPacket & {
  amount:           number;
  measurement_name: string;
  title:            string;
};
