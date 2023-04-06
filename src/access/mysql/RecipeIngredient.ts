import { Pool, RowDataPacket } from 'mysql2/promise';

export class RecipeIngredientRepository implements IRecipeIngredientRepository {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewByRecipeId(id: number) {
    const sql = `
      SELECT ri.amount, m.name AS measurement_name, i.name AS ingredient_name
      FROM recipe_ingredients ri
      INNER JOIN measurements m ON m.id = ri.measurement_id
      INNER JOIN ingredients i ON i.id = ri.ingredient_id
      WHERE ri.recipe_id = ?
      ORDER BY i.ingredient_type_id
    `;
    const [ rows ] = await this.pool.execute<RecipeIngredient[]>(sql, [id]);
    return rows;
  }

  async create(placeholders: string, recipeIngredients: number[]) {
    const sql = `INSERT INTO recipe_ingredients (recipe_id, amount, measurement_id, ingredient_id) VALUES ${placeholders}`;  // may be wrong, test these
    await this.pool.execute(sql, recipeIngredients);
  }
  
  async update(recipeId: number, placeholders: string, recipeIngredients: number[]) {
    const sql1 = `DELETE FROM recipe_ingredients WHERE recipe_id = ?`;
    const sql2 = recipeIngredients.length ? `INSERT INTO recipe_ingredients (recipe_id, amount, measurement_id, ingredient_id) VALUES ${placeholders}` : undefined;
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();
    try {
      // Rather than updating current values in the database, we delete them...
      await conn.query(sql1, [recipeId]);
      // ... and, if there are new values, we insert them.
      if (sql2) {
        await conn.query(sql2, recipeIngredients);
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async deleteByIngredientId(id: number) {
    const sql = `DELETE FROM recipe_ingredients WHERE ingredient_id = ?`;
    await this.pool.execute(sql, [id]);
  }

  async deleteByRecipeId(id: number) {
    const sql = `DELETE FROM recipe_ingredients WHERE recipe_id = ?`;
    await this.pool.execute(sql, [id]);
  }

  async deleteByRecipeIds(ids: number[]) {
    const sql = `DELETE FROM recipe_ingredients WHERE recipe_id = ANY(?)`;
    await this.pool.execute(sql, ids);
  }
}

export interface IRecipeIngredientRepository {
  pool:                 Pool;
  viewByRecipeId:       (id: number) =>                                                          Promise<RecipeIngredient[]>;
  create:               (placeholders: string, recipeIngredients: number[]) =>                   Promise<void>;
  update:               (recipeId: number, placeholders: string, recipeIngredients: number[]) => Promise<void>;
  deleteByIngredientId: (id: number) =>                                                          Promise<void>;
  deleteByRecipeId:     (id: number) =>                                                          Promise<void>;
  deleteByRecipeIds:    (ids: number[]) =>                                                       Promise<void>;
}

export type IMakeRecipeIngredient = {
  amount:        number;
  measurementId: number;
  id:            number;
};

export type RecipeIngredient = RowDataPacket & {
  amount:           number;
  measurement_name: string;
  ingredient_name:  string;
};
