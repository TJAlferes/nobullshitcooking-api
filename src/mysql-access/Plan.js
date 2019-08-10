class Plan {
  constructor(pool) {
    this.pool = pool;
    this.viewAllMyPrivatePlans = this.viewAllMyPrivatePlans.bind(this);
    this.viewMyPrivatePlan = this.viewMyPrivatePlan.bind(this);
    this.createMyPrivatePlan = this.createMyPrivatePlan.bind(this);
    this.updateMyPrivatePlan = this.updateMyPrivatePlan.bind(this);
    this.deleteMyPrivatePlan = this.deleteMyPrivatePlan.bind(this);
  }
  
  async viewAllMyPrivatePlans(ownerId) {
    const sql = `
      SELECT plan_id, plan_name
      FROM nobsc_plans
      WHERE owner_id = ?
    `;
    const [ plans ] = await this.pool.execute(sql, [ownerId]);
    return plans;
  }

  async viewMyPrivatePlan(ownerId, planId) {
    const sql = `
      SELECT plan_id, plan_name, plan_data
      FROM nobsc_plans
      WHERE owner_id = ? AND plan_id = ?
    `;
    const [ plan ] = await this.pool.execute(sql, [ownerId, planId]);
    return plan;
  }

  async createMyPrivatePlan(planToCreate) {
    const { authorId, ownerId, planName, planData } = planToCreate;
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

  async updateMyPrivatePlan(planToUpdateWith, planId) {
    const { authorId, ownerId, planName, planData } = planToUpdateWith;
    const sql = `
      UPDATE nobsc_plans
      SET author_id = ?, owner_id = ?, plan_name = ?, plan_data = ?
      WHERE owner_id = ? AND plan_id = ?
      LIMIT 1
    `;
    const [ updatedPlan ] = await this.pool.execute(sql, [
      authorId,
      ownerId,
      planName,
      planData,
      ownerId,
      planId
    ]);
    return updatedPlan;
  }

  async deleteMyPrivatePlan(ownerId, planId) {
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

module.exports = Plan;