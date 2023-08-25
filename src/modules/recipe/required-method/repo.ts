import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL';

export class RecipeMethodRepo extends MySQLRepo implements IRecipeMethodRepo {
  async viewByRecipeId(recipe_id: string) {
    const sql = `
      SELECT m.method_name
      FROM recipe_method rm
      INNER JOIN method m ON m.method_id = rm.method_id
      WHERE rm.recipe_id = ?
      ORDER BY m.method_id
    `;
    const [ rows ] = await this.pool.execute<RecipeMethodView[]>(sql, [recipe_id]);
    return rows;
  }

  async insert({ placeholders, recipe_methods }: InsertParams) {  // TO DO: change to namedPlaceholders using example below
    const sql = `INSERT INTO recipe_method (recipe_id, method_id) VALUES ${placeholders}`;
    await this.pool.execute(sql, recipe_methods);  // test that this works correctly!
  }
  
  async update({ recipe_id, placeholders, recipe_methods }: UpdateParams) {  // TO DO: change to namedPlaceholders using example below
    // Rather than updating current values in the database, we delete them,
    // and if there are new values, we insert them.
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();
    
    try {
      let sql = `DELETE FROM recipe_method WHERE recipe_id = ?`;

      await conn.query(sql, [recipe_id]);

      if (recipe_methods.length) {
        let sql = `
          INSERT INTO recipe_method (recipe_id, method_id)
          VALUES ${placeholders}
        `;

        await conn.query(sql, recipe_methods);
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
    const sql = `DELETE FROM recipe_method WHERE recipe_id = ?`;
    await this.pool.execute(sql, [recipe_id]);
  }

  /* not needed because of ON CASCADE DELETE ???
  async deleteByRecipeIds(ids: number[]) {
    const sql = `DELETE FROM recipe_method WHERE recipe_id = ANY(?)`;
    await this.pool.execute(sql, ids);
  }*/
}

export interface IRecipeMethodRepo {
  viewByRecipeId:    (recipe_id: string) =>    Promise<RecipeMethodView[]>;
  insert:            (params: InsertParams) => Promise<void>;
  update:            (params: UpdateParams) => Promise<void>;
  deleteByRecipeId:  (recipe_id: string) =>    Promise<void>;
  //deleteByRecipeIds: (ids: string[]) =>        Promise<void>;
}

/*export type MakeRecipeMethod = {
  id: number;
};*/

type RecipeMethodRow = {
  recipe_id: string;
  method_id: number;
};

type InsertParams = {
  placeholders:   string;
  recipe_methods: RecipeMethodRow[];
};

type UpdateParams = {
  recipe_id:      string;
  placeholders:   string;
  recipe_methods: RecipeMethodRow[];
};

type RecipeMethodView = RowDataPacket & {
  method_name: string;
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
