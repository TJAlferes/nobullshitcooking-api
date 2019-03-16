class Staff {
  constructor(pool) {
    this.pool = pool;
    this.viewAllStaff = this.viewAllStaff.bind(this);
    this.viewStaffById = this.viewStaffById.bind(this);
    this.getStaffByName = this.getStaffByName.bind(this);
    this.createStaff = this.createStaff.bind(this);
    this.updateStaff = this.updateStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
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
    const { id, name, password, avatar } = staffInfo;
    const sql = `
      INSERT INTO nobsc_staff
      (staff_id, staffname, password, avatar)
      VALUES
      (?, ?, ?, ?)
    `;
    return pool.execute(sql, [id, name, password, avatar]);
  }

  updateStaff(staffInfo) {
    const { id, name, password, avatar } = staffInfo;
    const sql = `
      UPDATE nobsc_staff
      SET staffname = ?, password = ?, avatar = ?
      WHERE staff_id = ?
      LIMIT 1
    `;
    return pool.execute(sql, [name, password, avatar, id]);
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
}

module.exports = Staff;