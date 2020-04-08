import { Pool } from 'mysql2/promise';

interface IPlan {
  authorId: number
  ownerId: number
  planName: string
  planData: PlanData
}

interface PlanData {
  1: PlanRecipe[],
  2: PlanRecipe[],
  3: PlanRecipe[],
  4: PlanRecipe[],
  5: PlanRecipe[],
  6: PlanRecipe[],
  7: PlanRecipe[],
  8: PlanRecipe[],
  9: PlanRecipe[],
  10: PlanRecipe[],
  11: PlanRecipe[],
  12: PlanRecipe[],
  13: PlanRecipe[],
  14: PlanRecipe[],
  15: PlanRecipe[],
  16: PlanRecipe[],
  17: PlanRecipe[],
  18: PlanRecipe[],
  19: PlanRecipe[],
  20: PlanRecipe[],
  21: PlanRecipe[],
  22: PlanRecipe[],
  23: PlanRecipe[],
  24: PlanRecipe[],
  25: PlanRecipe[],
  26: PlanRecipe[],
  27: PlanRecipe[],
  28: PlanRecipe[]
}

interface PlanRecipe {
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