import { MySQLRepo } from "../../shared/MySQL"

export class DayRepo extends MySQLRepo implements IDayRepo {
  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO day (day_id, plan_id, day_number)
      VALUES (:day_id, :plan_id, :day_number)
    `;
    await this.pool.execute(sql, params);
  }

  async update(params: InsertParams) {
    const sql = `
      UPDATE day
      SET
        plan_id    = :plan_id,
        day_number = :day_number
      WHERE day_id = :day_id
      LIMIT 1
    `;
    await this.pool.execute(sql, params);
  }

  async delete(day_id: string) {
    const sql = ``;
    await this.pool.execute(sql, [day_id]);
  }
}

interface IDayRepo {
  insert: (params: InsertParams) => Promise<void>;
  update: (params: InsertParams) => Promise<void>;
  delete: (day_id: string) =>       Promise<void>;
}

type InsertParams = {
  day_id:     string;
  plan_id:    string;
  day_number: number;
};
