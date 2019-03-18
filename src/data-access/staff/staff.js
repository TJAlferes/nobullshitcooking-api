class Staff {
  constructor(pool) {
    this.pool = pool;
    this.viewAllStaff = this.viewAllStaff.bind(this);
    this.viewStaffById = this.viewStaffById.bind(this);
    this.getStaffByName = this.getStaffByName.bind(this);
    this.createStaff = this.createStaff.bind(this);
    this.updateStaff = this.updateStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
    this.viewPlan = this.viewPlan.bind(this);
    this.updatePlan = this.updatePlan.bind(this);
  }

  viewAllStaff(starting, display) {
    const sql = `
      SELECT staffname, avatar
      FROM nobsc_staff
      ORDER BY staffname ASC
      LIMIT ${starting}, ${display}
    `;  // important (security): use ?, ? in LIMIT instead?
    return pool.execute(sql);
  }

  viewStaffById(staffId) {
    const sql = `
      SELECT staffname, avatar
      FROM nobsc_staff
      WHERE staff_id = ?
    `;
    return pool.execute(sql, [staffId]);
  }

  getStaffByName(staffname) {
    const sql = `
      SELECT staff_id, staffname, password
      FROM nobsc_staff
      WHERE staffname = ?
    `;
    return pool.execute(sql, [staffname]);
  }

  createStaff(staffInfo) {
    const { email, password, staffname, avatar, plan } = staffInfo;
    const sql = `
      INSERT INTO nobsc_staff
      (email, password, staffname, avatar, plan)
      VALUES
      (?, ?, ?, ?, ?)
    `;  // plan must be valid JSON
    return pool.execute(sql, [email, password, staffname, avatar, plan]);
  }

  updateStaff(staffInfo) {
    const { staffId, email, password, staffname, avatar } = staffInfo;
    const sql = `
      UPDATE nobsc_staff
      SET email = ?, password = ?, staffname = ?, avatar = ?
      WHERE staff_id = ?
      LIMIT 1
    `;
    return pool.execute(sql, [email, password, staffname, avatar, staffId]);
  }

  deleteStaff(staffId) {
    const sql = `
      DELETE
      FROM nobsc_staff
      WHERE staff_id = ?
      LIMIT 1
    `;
    return pool.execute(sql, [staffId]);
  }

  viewPlan(staffId) {
    const sql = `
      SELECT plan
      FROM nobsc_staff
      WHERE staff_id = ?
    `;  // JSON_EXTRACT() JSON_UNQUOTE() ?
    return pool.execute(sql, [staffId]);
  }

  updatePlan(staffInfo) {
    const { staffId, plan } = staffInfo;
    const sql = `
      UPDATE nobsc_staff
      SET plan = ?
      WHERE staff_id = ?
      LIMIT 1
    `;  // must be valid JSON, two options, either update the entire JSON or update only what needs to be updated
    return pool.execute(sql, [plan, staffId]);
  }
}

module.exports = Staff;