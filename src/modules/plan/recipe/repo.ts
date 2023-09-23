import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from "../../shared/MySQL";

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

  async insert({ placeholders, values }: InsertParams) {  // TO DO: change to namedPlaceholders using example below
    const sql = `
      INSERT INTO plan_recipe (plan_id, recipe_id, day_number, recipe_number)
      VALUES ${placeholders}
    `;
    await this.pool.execute(sql, values);
  }

  async update({ plan_id, placeholders, values }: UpdateParams) {  // TO DO: change to namedPlaceholders using example below
    // Rather than updating current values in the database, we delete them,
    // and if there are new values, we insert them.
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();

    try {

      let sql = `DELETE FROM plan_recipe WHERE plan_id = ?`;

      await conn.query(sql, [plan_id]);

      if (values.length) {
        let sql = `
          INSERT INTO plan_recipe (plan_id, recipe_id, day_number, recipe_number)
          VALUES ${placeholders}
        `;

        await conn.query(sql, values);
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
    await this.pool.execute(sql, [plan_id]);
  }
}

export interface PlanRecipeRepoInterface {
  viewByPlanId:   (plan_id: string) =>      Promise<PlanRecipeView[]>;
  insert:         (params: InsertParams) => Promise<void>;
  update:         (params: UpdateParams) => Promise<void>;
  deleteByPlanId: (plan_id: string) =>      Promise<void>;
}

type PlanRecipeRow = {
  plan_id:       string;
  recipe_id:     string;
  day_number:    number;
  recipe_number: number;
};

type InsertParams = {
  placeholders: string;
  values:       PlanRecipeRow[];
};

type UpdateParams = {
  plan_id:      string;
  placeholders: string;
  values:       PlanRecipeRow[];
};

// just guessing for now, find out on frontend
type PlanRecipeView = RowDataPacket & {
  image_url: string;
  title:     string;
};
