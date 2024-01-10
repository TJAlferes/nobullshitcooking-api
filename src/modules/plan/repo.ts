import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

import { NOBSC_USER_ID, UNKNOWN_USER_ID } from '../shared/model';
import { MySQLRepo } from '../shared/MySQL';

export class PlanRepo extends MySQLRepo implements PlanRepoInterface {
  async viewAll({ author_id, owner_id }: OverviewAllParams) {
    const sql = `${viewSql} WHERE p.author_id = ? AND p.owner_id = ?`;
    const [ rows ] = await this.pool.execute<PlanRecord[]>(sql, [author_id, owner_id]);
    if (!rows) return undefined;
    const results = organize(rows);
    return results;
  }

  async viewOneByPlanId(plan_id: string) {
    const sql = `${viewSql} WHERE p.plan_id = ?`;
    const [ [ row ] ] = await this.pool.execute<PlanRecord[]>(sql, [plan_id]);
    if (!row) return undefined;
    const [ result ] = organize([row]);
    return result;
  }

  async viewOneByPlanName({ plan_name, author_id, owner_id }: ViewOneByPlanNameParams) {
    const sql = `${viewSql} WHERE p.plan_name = ? AND p.author_id = ? AND p.owner_id = ?`;
    const [ [ row ] ] = await this.pool.execute<PlanRecord[]>(sql, [
      plan_name,
      author_id,
      owner_id
    ]);
    if (!row) return undefined;
    const [ result ] = organize([row]);
    return result;
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
    // log instead
    //if (result.affectedRows < 1) throw new Error('Query not successful.');
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
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [owner_id]);
    // log instead
    //if (result.affectedRows < 1) throw new Error('Query not successful.');
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
  viewAll:           (params: OverviewAllParams) =>       Promise<PlanView[] | undefined>;
  viewOneByPlanId:   (plan_id: string) =>                 Promise<PlanView | undefined>;
  viewOneByPlanName: (params: ViewOneByPlanNameParams) => Promise<PlanView | undefined>; 
  insert:            (params: InsertParams) =>            Promise<void>;
  update:            (params: UpdateParams) =>            Promise<void>;
  unattributeAll:    (author_id: string) =>               Promise<void>;
  unattributeOne:    (params: UnattributeOneParams) =>    Promise<void>;
  deleteAll:         (owner_id: string) =>                Promise<void>;
  deleteOne:         (params: DeleteOneParams) =>         Promise<void>;
}

type PlanRecord = RowDataPacket & {
  plan_id:   string;
  author_id: string;
  author:    string;
  owner_id:  string;
  plan_name: string;
  included_recipes: IncludedRecipe[];
};

type PlanView = {
  plan_id:   string;
  author_id: string;
  author:    string;
  owner_id:  string;
  plan_name: string;
  included_recipes: IncludedRecipes;
};

type IncludedRecipe = RowDataPacket & RecipeOverview & {
  day_number:    number;
  recipe_number: number;
};

type RecipeOverview = {
  recipe_id:      string;
  author_id:      string;
  owner_id:       string;
  recipe_type_id: number;
  cuisine_id:     number;
  author:         string;
  title:          string;
  image_filename: string;
};

export type IncludedRecipes = {
  [index: number]: RecipeOverview[];
  1: RecipeOverview[];
  2: RecipeOverview[];
  3: RecipeOverview[];
  4: RecipeOverview[];
  5: RecipeOverview[];
  6: RecipeOverview[];
  7: RecipeOverview[];
};

type OverviewAllParams = {
  author_id: string;
  owner_id:  string;
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
    p.author_id,
    u1.username AS author,
    p.owner_id,
    p.plan_name,
    (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'day_number', pr.day_number,
          'recipe_number', pr.recipe_number,
          'recipe_id', r.recipe_id,
          'author_id', r.author_id,
          'author', (
            SELECT u2.username
            FROM user u2
            WHERE r.author_id = u2.user_id
          ),
          'owner_id', r.owner_id,
          'recipe_type_id', r.recipe_type_id,
          'cuisine_id', r.cuisine_id,
          'title', r.title,
          'image_filename', (
            SELECT i1.image_filename
            FROM image i1
            INNER JOIN recipe_image ri1 ON i1.image_id = ri1.image_id
            WHERE ri1.recipe_id = r.recipe_id AND ri1.type = 1
            LIMIT 1
          )
        )
      )
      FROM plan_recipe pr
      INNER JOIN recipe r ON pr.recipe_id = r.recipe_id
      WHERE pr.plan_id = p.plan_id
    ) included_recipes
  FROM plan p
  INNER JOIN user u1 ON p.author_id = u1.user_id
`;

function organize(rows: PlanRecord[]) {
  const results: PlanView[] = [];

  if (!rows || rows.length < 1) return results;

  for (const row of rows) {
    if (!row) continue;

    const recipes: IncludedRecipes = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []};

    if (row.included_recipes) {
      row.included_recipes.map(({
        day_number,
        recipe_number,
        recipe_id,
          author_id,
          owner_id,
          recipe_type_id,
          cuisine_id,
          author,
          title,
          image_filename
      }) => {
        recipes[day_number][recipe_number] = {
          recipe_id,
          author_id,
          owner_id,
          recipe_type_id,
          cuisine_id,
          author,
          title,
          image_filename
        }
      });
    }

    results.push({
      plan_id: row.plan_id,
      author_id: row.author_id,
      author: row.author,
      owner_id: row.owner_id,
      plan_name: row.plan_name,
      included_recipes: recipes
    });
  }

  return results;
}
