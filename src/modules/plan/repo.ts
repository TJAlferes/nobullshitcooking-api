import { RowDataPacket } from 'mysql2/promise';
//import { Plan } from '../domain/plan';

import { MySQLRepo } from '../shared/MySQL';

export class PlanRepo extends MySQLRepo implements IPlanRepo {
  async viewAll(owner_id: string) {
    const sql = `SELECT plan_id, plan_name FROM plan WHERE owner_id = ?`;
    const [ rows ] = await this.pool.execute<PlanView[]>(sql, [owner_id]);
    return rows;
  }

  async viewOne(params: ViewOneParams) {
    const sql = `SELECT plan_id, plan_name FROM plan WHERE plan_id = :plan_id AND owner_id = :owner_id`;
    const [ [ row ] ] = await this.pool.execute<PlanView[]>(sql, params);
    return row;
  }

  async insert(params: InsertParams) {
    const sql = `INSERT INTO plan (plan_id, author_id, owner_id, plan_name) VALUES (:plan_id, :author_id, :owner_id, :plan_name)`;
    await this.pool.execute(sql, params);
  }

  async update(params: InsertParams) {
    const sql = `UPDATE plan SET plan_name = :plan_name WHERE plan_id = :plan_id AND owner_id = :owner_id LIMIT 1`;
    await this.pool.execute(sql, params);
  }

  async deleteAll(owner_id: string) {
    const sql = `DELETE FROM plan WHERE owner_id = ?`;
    await this.pool.execute(sql, [owner_id]);
  }

  async deleteOne(params: DeleteOneParams) {
    const sql = `DELETE FROM plan WHERE plan_id = :plan_id AND owner_id = :owner_id LIMIT 1`;
    await this.pool.execute(sql, params);
  }
}

export interface IPlanRepo {
  viewAll:   (owner_id: string) =>        Promise<PlanView[]>;  // TO DO: JOIN on day and day_recipe
  viewOne:   (params: ViewOneParams) =>   Promise<PlanView>;    // TO DO: JOIN on day and day_recipe
  insert:    (params: InsertParams) =>    Promise<void>;
  update:    (params: InsertParams) =>    Promise<void>;
  deleteAll: (owner_id: string) =>        Promise<void>;
  deleteOne: (params: DeleteOneParams) => Promise<void>;
}

type PlanView = RowDataPacket & {
  plan_id:   string;
  plan_name: string;
  //data: ;  // TO DO: JOIN on day and day_recipe
};

type InsertParams = {
  plan_id:   string;
  author_id: string;
  owner_id:  string;
  plan_name: string;
};

type ViewOneParams = {
  plan_id:  string;
  owner_id: string;
};

type DeleteOneParams = {
  plan_id:  string;
  owner_id: string;
}