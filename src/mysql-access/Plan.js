class Plan {
  constructor(pool) {
    this.pool = pool;
    this.viewAllMyPrivatePlans = this.viewAllMyPrivatePlans.bind(this);
    this.viewMyPrivatePlan = this.viewMyPrivatePlan.bind(this);
    this.createMyPrivatePlan = this.createMyPrivatePlan.bind(this);
    this.updateMyPrivatePlan = this.updateMyPrivatePlan.bind(this);
    this.deleteMyPrivatePlan = this.deleteMyPrivatePlan.bind(this);
  }

  async viewAllMyPrivatePlans(userId) {
    const sql = `
      SELECT plan_name
      FROM nobsc_plans
      WHERE author_id = ? AND owner_id = ?
    `;
    const [ plans ] = await this.pool.execute(sql, [userId, userId]);
    return plans;
  }

  async viewMyPrivatePlan(userId, planName) {
    const sql = `
      SELECT plan_name, plan_data
      FROM nobsc_plans
      WHERE author_id = ? AND owner_id = ? AND plan_name = ?
    `;
    const [ plan ] = await this.pool.execute(sql, [userId, userId, planName]);
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

  async updateMyPrivatePlan(updatedPlanName, updatedPlanData, userId, oldPlanName) {
    const sql = `
      UPDATE nobsc_plans
      SET plan_name = ?, plan_data = ?
      WHERE author_id = ? AND owner_id = ? AND plan_name = ?
      LIMIT 1
    `;
    const [ updatedPlan ] = await this.pool.execute(sql, [
      updatedPlanName,
      updatedPlanData,
      userId,
      userId,
      oldPlanName
    ]);
    return updatedPlan;
  }

  async deleteMyPrivatePlan(userId, planName) {
    const sql = `
      DELETE
      FROM nobsc_plans
      WHERE author_id = ? AND owner_id = ? AND plan_name = ?
      LIMIT 1
    `;
    const [ deletedPlan ] = await this.pool.execute(sql, [userId, userId, planName]);
    return deletedPlan;
  }
}

module.exports = Plan;