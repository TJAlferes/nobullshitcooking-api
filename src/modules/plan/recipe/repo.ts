import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL';

export class PlanRecipeRepo extends MySQLRepo implements PlanRecipeRepoInterface {
  async viewByPlanId(plan_id: string) {
    // TO DO: finish
    // pr.day_number
    // pr.recipe_number
    // pr.recipe_id
    // r.author_id,
    // u.author,
    // r.owner_id,
    // r.recipe_type_id,
    // r.cuisine_id,
    // r.title,
    // ri.image_filename
    const sql = `
      SELECT r.image_filename, r.title
      FROM plan_recipe pr
      INNER JOIN recipe r ON r.recipe_id = pr.recipe_id
      INNER JOIN recipe_image ri ON ri.recipe_id = pr.recipe_id
      INNER JOIN image i 
      WHERE pr.plan_id = ?
    `;
    const [ rows ] = await this.pool.execute<PlanRecipeView[]>(sql, [plan_id]);
    return rows;
  }  // Where is this used?

  async bulkInsert({ placeholders, plan_recipes }: BulkInsertParams) {  // TO DO: change to namedPlaceholders using example below
    const flat = plan_recipes.flatMap(({
      plan_id,
      recipe_id,
      day_number,
      recipe_number
    }) => ([
      plan_id,
      recipe_id,
      day_number,
      recipe_number
    ]));
    const sql = `
      INSERT INTO plan_recipe (plan_id, recipe_id, day_number, recipe_number)
      VALUES ${placeholders}
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, flat);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }  // just change bulkInserts to transactions?

  async bulkUpdate({ plan_id, placeholders, plan_recipes }: BulkUpdateParams) {
    // Rather than updating current values in the database, we delete them,
    // and if there are new values, we insert them.
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();
    try {
      let sql = `DELETE FROM plan_recipe WHERE plan_id = ?`;
      await conn.query(sql, [plan_id]);
      if (plan_recipes.length > 0) {
        const flat = plan_recipes.flatMap(({
          plan_id,
          recipe_id,
          day_number,
          recipe_number
        }) => ([
          plan_id,
          recipe_id,
          day_number,
          recipe_number
        ]));
        let sql = `
          INSERT INTO plan_recipe (plan_id, recipe_id, day_number, recipe_number)
          VALUES ${placeholders}
        `;
        await conn.query(sql, flat);
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
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [plan_id]);
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
  image_filename: string;
  title:          string;
};
