class Method {
  constructor(pool) {
    this.pool = pool;
    this.viewAllMethods = this.viewAllMethods.bind(this);
    this.viewMethodById = this.viewMethodById.bind(this);
  }

  async viewAllMethods() {
    const sql = `
      SELECT method_id, method_name
      FROM nobsc_methods
    `;
    const [ allMethods ] = await this.pool.execute(sql);
    return allMethods;
  }

  async viewMethodById(methodId) {
    const sql = `
      SELECT method_id, method_name
      FROM nobsc_methods
      WHERE method_id = ?
    `;
    const [ method ] = await this.pool.execute(sql, [methodId]);
    return method;
  }
}

module.exports = Method;