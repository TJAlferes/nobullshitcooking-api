import { Pool } from 'mysql2/promise';

interface IPlan {
  authorId: number
  ownerId: number
  planName: string
  planData: IPlanData
}

interface IPlanData {
  1: IPlanRecipe[],
  2: IPlanRecipe[],
  3: IPlanRecipe[],
  4: IPlanRecipe[],
  5: IPlanRecipe[],
  6: IPlanRecipe[],
  7: IPlanRecipe[],
  8: IPlanRecipe[],
  9: IPlanRecipe[],
  10: IPlanRecipe[],
  11: IPlanRecipe[],
  12: IPlanRecipe[],
  13: IPlanRecipe[],
  14: IPlanRecipe[],
  15: IPlanRecipe[],
  16: IPlanRecipe[],
  17: IPlanRecipe[],
  18: IPlanRecipe[],
  19: IPlanRecipe[],
  20: IPlanRecipe[],
  21: IPlanRecipe[],
  22: IPlanRecipe[],
  23: IPlanRecipe[],
  24: IPlanRecipe[],
  25: IPlanRecipe[],
  26: IPlanRecipe[],
  27: IPlanRecipe[],
  28: IPlanRecipe[]
}

interface IPlanRecipe {
  key: string
  image: string
  text: string
}

interface IPlanUpdate {
  planName: string
  planData: string
  ownerId: string
}

export class Plan {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewAllMyPrivatePlans = this.viewAllMyPrivatePlans.bind(this);
    this.viewMyPrivatePlan = this.viewMyPrivatePlan.bind(this);
    this.createMyPrivatePlan = this.createMyPrivatePlan.bind(this);
    this.updateMyPrivatePlan = this.updateMyPrivatePlan.bind(this);
    this.deleteMyPrivatePlan = this.deleteMyPrivatePlan.bind(this);
  }
  
  async viewAllMyPrivatePlans(ownerId: number) {
    const sql = `
      SELECT plan_id, plan_name, plan_data
      FROM nobsc_plans
      WHERE owner_id = ?
    `;
    const [ plans ] = await this.pool.execute(sql, [ownerId]);
    return plans;
  }

  async viewMyPrivatePlan(ownerId: number, planId: number) {
    const sql = `
      SELECT plan_id, plan_name, plan_data
      FROM nobsc_plans
      WHERE owner_id = ? AND plan_id = ?
    `;
    const [ plan ] = await this.pool.execute(sql, [ownerId, planId]);
    return plan;
  }

  async createMyPrivatePlan({ authorId, ownerId, planName, planData }: IPlan) {
    const sql = `
      INSERT INTO nobsc_plans (author_id, owner_id, plan_name, plan_data)
      VALUES (?, ?, ?, ?)
    `;
    const [ createdPlan ] = await this.pool.execute(sql, [
      authorId,
      ownerId,
      planName,
      planData
    ]);
    return createdPlan;
  }

  async updateMyPrivatePlan(
    {
      planName,
      planData,
      ownerId
    }: IPlanUpdate,
    planId: number
  ) {
    const sql = `
      UPDATE nobsc_plans
      SET plan_name = ?, plan_data = ?
      WHERE owner_id = ? AND plan_id = ?
      LIMIT 1
    `;
    const [ updatedPlan ] = await this.pool.execute(sql, [
      planName,
      planData,
      ownerId,
      planId
    ]);
    return updatedPlan;
  }

  async deleteMyPrivatePlan(ownerId: number, planId: number) {
    const sql = `
      DELETE
      FROM nobsc_plans
      WHERE owner_id = ? AND plan_id = ?
      LIMIT 1
    `;
    const [ deletedPlan ] = await this.pool.execute(sql, [ownerId, planId]);
    return deletedPlan;
  }
}