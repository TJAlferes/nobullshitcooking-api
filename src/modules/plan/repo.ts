import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

import type { RecipeOverview }            from '../recipe/repo.js';
import { NOBSC_USER_ID, UNKNOWN_USER_ID } from '../shared/model.js';
import { MySQLRepo }                      from '../shared/MySQL.js';

export class PlanRepo extends MySQLRepo implements PlanRepoInterface {
  async viewAll({ author_id, owner_id }: OverviewAllParams) {
    const sql = viewSql;
    const [ rows ] = await this.pool.execute<PlanView[]>(sql, [author_id, owner_id]);
    return rows;
  }  // for logged in user

  async viewOneByPlanId(params: ViewOneByPlanIdParams) {
    const sql = `${viewSql} AND p.plan_id = :plan_id`;
    const [ [ row ] ] = await this.pool.execute<PlanView[]>(sql, params);
    return row;
  }

  async viewOneByPlanName(params: ViewOneByPlanNameParams) {
    const sql = `${viewSql} AND p.plan_name = :plan_name`;
    const [ [ row ] ] = await this.pool.execute<PlanView[]>(sql, params);
    return row;
  }

  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO plan (plan_id, author_id, owner_id, plan_name)
      VALUES (:plan_id, :author_id, :owner_id, :plan_name)
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async update(params: UpdateParams) {
    const sql = `
      UPDATE plan
      SET plan_name = :plan_name
      WHERE owner_id = :owner_id AND plan_id = :plan_id
      LIMIT 1
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async unattributeAll(author_id: string) {
    // TO DO: move to service
    if (author_id === NOBSC_USER_ID || author_id === UNKNOWN_USER_ID) {
      return;
    }

    const owner_id        = NOBSC_USER_ID;
    const unknown_user_id = UNKNOWN_USER_ID;

    const sql = `
      UPDATE plan
      SET author_id = :unknown_user_id
      WHERE author_id = :author_id AND owner_id = :owner_id
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, {
      unknown_user_id,
      author_id,
      owner_id
    });
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async unattributeOne({ author_id, plan_id }: UnattributeOneParams) {
    // TO DO: move to service
    if (author_id === NOBSC_USER_ID || author_id === UNKNOWN_USER_ID) {
      return;
    }

    const owner_id        = NOBSC_USER_ID;
    const unknown_user_id = UNKNOWN_USER_ID;

    const sql = `
      UPDATE plan
      SET author_id = :unknown_user_id
      WHERE
            author_id = :author_id
        AND owner_id  = :owner_id
        AND plan_id = :plan_id
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, {
      unknown_user_id,
      author_id,
      owner_id,
      plan_id
    });
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteAll(owner_id: string) {
    const sql = `DELETE FROM plan WHERE owner_id = ?`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, owner_id);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteOne(params: DeleteOneParams) {
    const sql = `
      DELETE FROM plan
      WHERE owner_id = :owner_id AND plan_id = :plan_id
      LIMIT 1
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
}

export interface PlanRepoInterface {
  viewAll:           (params: OverviewAllParams) =>       Promise<PlanView[]>;
  viewOneByPlanId:   (params: ViewOneByPlanIdParams) =>   Promise<PlanView>;
  viewOneByPlanName: (params: ViewOneByPlanNameParams) => Promise<PlanView>; 
  insert:            (params: InsertParams) =>            Promise<void>;
  update:            (params: UpdateParams) =>            Promise<void>;
  unattributeAll:    (author_id: string) =>               Promise<void>;
  unattributeOne:    (params: UnattributeOneParams) =>    Promise<void>;
  deleteAll:         (owner_id: string) =>                Promise<void>;
  deleteOne:         (params: DeleteOneParams) =>         Promise<void>;
}

type PlanView = RowDataPacket & {
  plan_id:   string;
  author_id: string;
  author:    string;
  owner_id:  string;
  plan_name: string;
  included_recipes: RecipeOverview[][];
};

type OverviewAllParams = {
  author_id: string;
  owner_id:  string;
};

type ViewOneByPlanIdParams = {
  author_id: string;
  owner_id:  string;
  plan_id:   string;
};

type ViewOneByPlanNameParams = {
  author_id: string;
  owner_id:  string;
  plan_name: string;
};

type InsertParams = {
  plan_id:   string;
  author_id: string;
  owner_id:  string;
  plan_name: string;
};

type UpdateParams = {
  plan_name: string;
  owner_id:  string;
  plan_id:   string;
};

type UnattributeOneParams = {
  author_id: string;
  plan_id:   string;
};

type DeleteOneParams = {
  owner_id: string;
  plan_id:  string;
};

const viewSql = `
  SELECT
    p.plan_id,
    p.plan_name,
    p.author_id,
    p.owner_id,
    JSON_ARRAYAGG(
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'recipe_id',      r.recipe_id
          'author_id',      r.author_id,
          'owner_id',       r.owner_id,
          'recipe_type_id', r.recipe_type_id,
          'cuisine_id',     r.cuisine_id,
          'author',         u.username,
          'title',          r.title,
          'image_filename', (
            SELECT
              i.image_filename
            FROM recipe_image ri
            INNER JOIN recipe_image ri ON ri.recipe_id = r.recipe_id
            INNER JOIN image i         ON i.image_id = ri.image_id
            INNER JOIN user u        ON r.author_id = u.user_id
            WHERE ri.type = 1
          ) image_filename
        )
      ) ORDER BY pr.recipe_number
    ) AS included_recipes
  FROM plan p
  LEFT JOIN plan_recipe pr ON p.plan_id     = pr.plan_id
  LEFT JOIN recipe r       ON pr.recipe_id = r.recipe_id
  WHERE p.plan_id = ?
  ORDER BY pr.day_number
  WHERE p.author_id = :author_id AND p.owner_id = :owner_id
`;
