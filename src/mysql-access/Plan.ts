import { Pool, RowDataPacket } from 'mysql2/promise';

export class Plan implements IPlan {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewAllMyPrivatePlans = this.viewAllMyPrivatePlans.bind(this);
    this.viewMyPrivatePlan = this.viewMyPrivatePlan.bind(this);
    this.createMyPrivatePlan = this.createMyPrivatePlan.bind(this);
    this.updateMyPrivatePlan = this.updateMyPrivatePlan.bind(this);
    this.deleteMyPrivatePlan = this.deleteMyPrivatePlan.bind(this);
    this.deleteAllMyPrivatePlans = this.deleteAllMyPrivatePlans.bind(this);
  }
  
  async viewAllMyPrivatePlans(ownerId: number) {
    const sql = `
      SELECT plan_id, plan_name, plan_data
      FROM nobsc_plans
      WHERE owner_id = ?
    `;
    const [ plans ] = await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
    return plans;
  }

  async viewMyPrivatePlan(planId: number, ownerId: number) {
    const sql = `
      SELECT plan_id, plan_name, plan_data
      FROM nobsc_plans
      WHERE owner_id = ? AND plan_id = ?
    `;
    const [ plan ] = await this.pool
    .execute<RowDataPacket[]>(sql, [ownerId, planId]);
    return plan;
  }

  async createMyPrivatePlan({
    authorId,
    ownerId,
    planName,
    planData
  }: ICreatingPlan) {
    const sql = `
      INSERT INTO nobsc_plans (author_id, owner_id, plan_name, plan_data)
      VALUES (?, ?, ?, ?)
    `;
    const [ createdPlan ] = await this.pool.execute<RowDataPacket[]>(sql, [
      authorId,
      ownerId,
      planName,
      planData
    ]);
    return createdPlan;
  }

  async updateMyPrivatePlan({
    planId,
    authorId,
    ownerId,
    planName,
    planData
  }: IUpdatingPlan) {
    const sql = `
      UPDATE nobsc_plans
      SET plan_name = ?, plan_data = ?
      WHERE owner_id = ? AND plan_id = ?
      LIMIT 1
    `;
    const [ updatedPlan ] = await this.pool.execute<RowDataPacket[]>(sql, [
      planName,
      planData,
      ownerId,
      planId
    ]);
    return updatedPlan;
  }

  async deleteMyPrivatePlan(planId: number, ownerId: number) {
    const sql = `
      DELETE
      FROM nobsc_plans
      WHERE owner_id = ? AND plan_id = ?
      LIMIT 1
    `;
    const [ deletedPlan ] = await this.pool
    .execute<RowDataPacket[]>(sql, [ownerId, planId]);
    return deletedPlan;
  }

  async deleteAllMyPrivatePlans(ownerId: number) {
    const sql = `
      DELETE
      FROM nobsc_plans
      WHERE owner_id = ?
    `;
    await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IPlan {
  pool: Pool;
  viewAllMyPrivatePlans(ownerId: number): Data;
  viewMyPrivatePlan(planId: number, ownerId: number): Data;
  createMyPrivatePlan({
    authorId,
    ownerId,
    planName,
    planData
  }: ICreatingPlan): Data;
  updateMyPrivatePlan({
    planId,
    authorId,
    ownerId,
    planName,
    planData
  }: IUpdatingPlan): Data;
  deleteMyPrivatePlan(planId: number, ownerId: number): Data;
  deleteAllMyPrivatePlans(ownerId: number): void;
}

interface ICreatingPlan {
  authorId: number;
  ownerId: number;
  planName: string;
  planData: string;
}

interface IUpdatingPlan extends ICreatingPlan {
  planId: number;
}