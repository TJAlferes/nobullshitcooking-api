import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from './MySQL';

export class RecipeSubrecipeRepo extends MySQLRepo implements IRecipeSubrecipeRepo {
  async viewByRecipeId(recipe_id: string) {
    const sql = `
      SELECT rs.amount, u.unit_name, r.title
      FROM recipe_subrecipe rs
      INNER JOIN unit u ON u.unit_id = rs.unit_id
      INNER JOIN recipe r ON r.recipe_id = rs.subrecipe_id
      WHERE rs.recipe_id = ?
      ORDER BY r.recipe_type_id
    `;
    const [ rows ] = await this.pool.execute<RecipeSubrecipeView[]>(sql, [recipe_id]);
    return rows;
  }

  async insert({ placeholders, recipe_subrecipes }: InsertParams) {  // TO DO: change to namedPlaceholders using example below
    const sql = `INSERT INTO recipe_subrecipe (recipe_id, amount, unit_id, subrecipe_id) VALUES ${placeholders}`;
    await this.pool.execute(sql, recipe_subrecipes);
  }
  
  async update({ recipe_id, placeholders, recipe_subrecipes }: UpdateParams) {  // TO DO: change to namedPlaceholders using example below
    const sql1 = `DELETE FROM recipe_subrecipe WHERE recipe_id = ?`;
    const sql2 = recipe_subrecipes.length ? `INSERT INTO recipe_subrecipe (recipe_id, amount, unit_id, subrecipe_id) VALUES ${placeholders}` : undefined;
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();
    try {
      // Rather than updating current values in the database, we delete them...
      await conn.query(sql1, [recipe_id]);
      // ... and, if there are new values, we insert them.
      if (sql2) {
        await conn.query(sql2, recipe_subrecipes);
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
    const sql = `DELETE FROM recipe_subrecipe WHERE recipe_id = ?`;
    await this.pool.execute(sql, [recipe_id]);
  }

  /* not needed because of ON CASCADE DELETE ???
  async deleteByRecipeIds(ids: number[]) {
    const sql = `DELETE FROM recipe_subrecipe WHERE recipe_id = ANY(?)`;
    await this.pool.execute(sql, ids);
  }*/

  async deleteBySubrecipeId(subrecipe_id: string) {
    const sql = `DELETE FROM recipe_subrecipe WHERE subrecipe_id = ?`;
    await this.pool.execute(sql, [subrecipe_id]);
  }

  /* not needed because of ON CASCADE DELETE ???
  async deleteBySubrecipeIds(ids: number[]) {
    const sql = `DELETE FROM recipe_subrecipe WHERE subrecipe_id = ANY(?)`;
    await this.pool.execute(sql, ids);
  }*/
}

export interface IRecipeSubrecipeRepo {
  viewByRecipeId:       (recipe_id: string) =>    Promise<RecipeSubrecipeView[]>;
  insert:               (params: InsertParams) => Promise<void>;
  update:               (params: UpdateParams) => Promise<void>;
  deleteBySubrecipeId:  (subrecipe_id: string) => Promise<void>;
  //deleteBySubrecipeIds: (ids: string;[]) =>       Promise<void>;
  deleteByRecipeId:     (recipe_id: string) =>    Promise<void>;
  //deleteByRecipeIds:    (ids: string;[]) =>       Promise<void>;
}

/*export type MakeRecipeSubrecipe = {
  amount:        number;
  unitId: number;
  id:            number;
};*/

type RecipeSubrecipeRow = {
  recipe_id:    string;
  amount:       number;
  unit_id:      number;
  subrecipe_id: string;
};

type InsertParams = {
  placeholders:      string;
  recipe_subrecipes: RecipeSubrecipeRow[];
};

type UpdateParams = {
  recipe_id:         string;
  placeholders:      string;
  recipe_subrecipes: RecipeSubrecipeRow[];
};

type RecipeSubrecipeView = RowDataPacket & {
  amount:          number;
  unit_name:       string;
  subrecipe_title: string;
};

/*
async function bulkInsertMultipleRows(dataArray) {
  const sql = `
    INSERT INTO equipment
    (id, name)
    VALUES
    ${dataArr.map((_, index) => `(:id${index}, :name${index})`).join(', ')}
  `;
  await this.pool.execute.(sql, dataArr);
}
*/