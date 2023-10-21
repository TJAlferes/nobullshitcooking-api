import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

import { MySQLRepo } from "../../shared/MySQL.js";

export class PlanRecipeRepo extends MySQLRepo implements PlanRecipeRepoInterface {
  async viewByPlanId(plan_id: string) {
    const sql = `
      SELECT r.image_url, r.title
      FROM plan_recipe pr
      INNER JOIN recipe r ON r.recipe_id = dr.recipe_id
      WHERE pr.plan_id = ?
      ORDER BY pr.
    `;
    const [ rows ] = await this.pool.execute<PlanRecipeView[]>(sql, [plan_id]);
    return rows;
  }

  async bulkInsert({ placeholders, plan_recipes }: BulkInsertParams) {  // TO DO: change to namedPlaceholders using example below
    const sql = `
      INSERT INTO plan_recipe (plan_id, recipe_id, day_number, recipe_number)
      VALUES ${placeholders}
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, plan_recipes);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
    // just change bulkInserts to transactions?
  }

  async bulkUpdate({ plan_id, placeholders, plan_recipes }: BulkUpdateParams) {  // TO DO: change to namedPlaceholders using example below
    // Rather than updating current values in the database, we delete them,
    // and if there are new values, we insert them.
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();
    try {
      let sql = `DELETE FROM plan_recipe WHERE plan_id = ?`;
      await conn.query(sql, [plan_id]);
      if (plan_recipes.length > 0) {
        let sql = `
          INSERT INTO plan_recipe (plan_id, recipe_id, day_number, recipe_number)
          VALUES ${placeholders}
        `;
        await conn.query(sql, plan_recipes);
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async deleteByPlanId(plan_id: string) {
    const sql = `DELETE FROM plan_recipe WHERE plan_id = ?`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, plan_id);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
}

export interface PlanRecipeRepoInterface {
  viewByPlanId:   (plan_id: string) =>          Promise<PlanRecipeView[]>;
  bulkInsert:     (params: BulkInsertParams) => Promise<void>;
  bulkUpdate:     (params: BulkUpdateParams) => Promise<void>;
  deleteByPlanId: (plan_id: string) =>          Promise<void>;
}

type PlanRecipeRow = {
  plan_id:       string;
  recipe_id:     string;
  day_number:    number;
  recipe_number: number;
};

type BulkInsertParams = {
  placeholders: string;
  plan_recipes: PlanRecipeRow[];
};

type BulkUpdateParams = BulkInsertParams & {
  plan_id: string;
};

// just guessing for now, find out on frontend
type PlanRecipeView = RowDataPacket & {
  image_url: string;
  title:     string;
};
