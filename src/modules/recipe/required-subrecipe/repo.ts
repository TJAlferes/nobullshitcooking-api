import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL';

export class RecipeSubrecipeRepo extends MySQLRepo implements RecipeSubrecipeRepoInterface {
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

  async bulkInsert({ placeholders, recipe_subrecipes }: BulkInsertParams) {  // TO DO: change to namedPlaceholders using example below
    const sql = `
      INSERT INTO recipe_subrecipe (recipe_id, amount, unit_id, subrecipe_id)
      VALUES ${placeholders}
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, recipe_subrecipes);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
  
  async bulkUpdate({ recipe_id, placeholders, recipe_subrecipes }: BulkUpdateParams) {  // TO DO: change to namedPlaceholders using example below
    // Rather than updating current values in the database, we delete them,
    // and if there are new values, we insert them.
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();
    try {
      let sql = `DELETE FROM recipe_subrecipe WHERE recipe_id = ?`;
      await conn.query(sql, [recipe_id]);
      if (recipe_subrecipes.length > 0) {
        let sql = `
          INSERT INTO recipe_subrecipe (recipe_id, amount, unit_id, subrecipe_id)
          VALUES ${placeholders}
        `;
        await conn.query(sql, recipe_subrecipes);
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
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [recipe_id]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteBySubrecipeId(subrecipe_id: string) {
    const sql = `DELETE FROM recipe_subrecipe WHERE subrecipe_id = ?`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [subrecipe_id]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
}

export interface RecipeSubrecipeRepoInterface {
  viewByRecipeId:       (recipe_id: string) =>        Promise<RecipeSubrecipeView[]>;
  bulkInsert:           (params: BulkInsertParams) => Promise<void>;
  bulkUpdate:           (params: BulkUpdateParams) => Promise<void>;
  deleteBySubrecipeId:  (subrecipe_id: string) =>     Promise<void>;
  deleteByRecipeId:     (recipe_id: string) =>        Promise<void>;
}

type RecipeSubrecipeRow = {
  recipe_id:    string;
  amount:       number | null;
  unit_id:      number | null;
  subrecipe_id: string;
};

type BulkInsertParams = {
  placeholders:      string;
  recipe_subrecipes: RecipeSubrecipeRow[];
};

type BulkUpdateParams = {
  recipe_id:         string;
  placeholders:      string;
  recipe_subrecipes: RecipeSubrecipeRow[];
};

type RecipeSubrecipeView = RowDataPacket & {
  amount:          number | null;
  unit_name:       string | null;  // ???
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