import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL.js';

// TO DO: store fullname instead of name???
export class RecipeIngredientRepo extends MySQLRepo implements RecipeIngredientRepoInterface {
  async viewByRecipeId(recipe_id: string) {
    // TO DO: ingredient_fullname
    const sql = `
      SELECT ri.amount, u.unit_name, i.ingredient_name
      FROM recipe_ingredient ri
      INNER JOIN unit u       ON u.unit_id = ri.unit_id
      INNER JOIN ingredient i ON i.ingredient_id = ri.ingredient_id
      WHERE ri.recipe_id = ?
      ORDER BY i.ingredient_type_id
    `;
    const [ rows ] = await this.pool.execute<RecipeIngredientView[]>(sql, [recipe_id]);
    return rows;
  }

  async bulkInsert({ placeholders, recipe_ingredients }: BulkInsertParams) {  // TO DO: change to namedPlaceholders using example below
    const sql = `
      INSERT INTO recipe_ingredient (recipe_id, amount, unit_id, ingredient_id)
      VALUES ${placeholders}
    `;  // test these
    await this.pool.execute(sql, recipe_ingredients);
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, recipe_ingredients);
    if (!result) throw new Error('Query not successful.');
  }
  
  async bulkUpdate({ recipe_id, placeholders, recipe_ingredients }: BulkUpdateParams) {  // TO DO: change to namedPlaceholders using example below
    // Rather than updating current values in the database, we delete them,
    // and if there are new values, we insert them.
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();
    try {
      let sql = `DELETE FROM recipe_ingredient WHERE recipe_id = ?`;
      await conn.query(sql, [recipe_id]);
      if (recipe_ingredients.length > 0) {
        let sql = `
          INSERT INTO recipe_ingredients (recipe_id, amount, unit_id, ingredient_id)
          VALUES ${placeholders}
        `;
        await conn.query(sql, recipe_ingredients);
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async deleteByIngredientId(ingredient_id: string) {
    const sql = `DELETE FROM recipe_ingredient WHERE ingredient_id = ?`;
    await this.pool.execute(sql, [ingredient_id]);
  }

  async deleteByRecipeId(recipe_id: string) {
    const sql = `DELETE FROM recipe_ingredient WHERE recipe_id = ?`;
    await this.pool.execute(sql, [recipe_id]);
  }
}

export interface RecipeIngredientRepoInterface {
  viewByRecipeId:       (recipe_id: string) =>        Promise<RecipeIngredientView[]>;
  bulkInsert:           (params: BulkInsertParams) => Promise<void>;
  bulkUpdate:           (params: BulkUpdateParams) => Promise<void>;
  deleteByIngredientId: (ingredient_id: string) =>    Promise<void>;
  deleteByRecipeId:     (recipe_id: string) =>        Promise<void>;
}

type RecipeIngredientRow = {
  recipe_id:     string;
  amount:        number | null;
  unit_id:       number | null;
  ingredient_id: string;
};

type BulkInsertParams = {
  placeholders:       string;
  recipe_ingredients: RecipeIngredientRow[];
};

type BulkUpdateParams = BulkInsertParams & {
  recipe_id: string;
};

type RecipeIngredientView = RowDataPacket & {
  amount:          number | null;
  unit_name:       string | null;  // ???
  ingredient_name: string;
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
