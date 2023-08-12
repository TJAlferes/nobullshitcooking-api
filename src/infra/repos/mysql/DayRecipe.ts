import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from "./MySQL"

export class DayRecipeRepo extends MySQLRepo implements IDayRecipeRepo {
  async viewByRecipeId(recipe_id: string) {
    const sql = `
      SELECT r.image_url, r.title
      FROM day_recipe dr
      INNER JOIN recipe r ON r.recipe_id = dr.recipe_id
      WHERE dr.recipe_id = ?
      ORDER BY r.title
    `;
    const [ rows ] = await this.pool.execute<DayRecipeView[]>(sql, [recipe_id]);
    return rows;
  }

  async insert({ placeholders, day_recipes }: InsertParams) {  // TO DO: change to namedPlaceholders using example below
    const sql = `INSERT INTO day_recipe (day_id, recipe_id) VALUES ${placeholders}`;
    await this.pool.execute(sql, day_recipes);  // test that this works correctly!
  }

  async update({ day_id, placeholders, day_recipes }: UpdateParams) {  // TO DO: change to namedPlaceholders using example below
    const sql1 = `DELETE FROM day_recipe WHERE day_id = ?`;
    const sql2 = day_recipes.length ? `INSERT INTO day_recipe (day_id, recipe_id) VALUES ${placeholders}` : undefined;
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();
    try {
      // Rather than updating current values in the database, we delete them...
      await conn.query(sql1, [day_id]);
      // ... and, if there are new values, we insert them.
      if (sql2) {
        await conn.query(sql2, day_recipes);
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async deleteByRecipeId(recipe_id: string) {
    const sql = `DELETE FROM day_recipe WHERE recipe_id = ?`;
    await this.pool.execute(sql, [recipe_id]);
  }
}

interface IDayRecipeRepo {
  viewByRecipeId:   (recipe_id: string) =>    Promise<DayRecipeView[]>;
  insert:           (params: InsertParams) => Promise<void>;
  update:           (params: UpdateParams) => Promise<void>;
  deleteByRecipeId: (recipe_id: string) =>    Promise<void>;
}

type DayRecipeRow = {
  day_id:    string;
  recipe_id: string;
};

type InsertParams = {
  placeholders: string;
  day_recipes:  DayRecipeRow[];
};

type UpdateParams = {
  day_id:       string;
  placeholders: string;
  day_recipes:  DayRecipeRow[];
};

// just guessing for now, find out on frontend
type DayRecipeView = RowDataPacket & {
  image_url: string;
  title:     string;
};
