class Staff {
  constructor(pool) {
    this.pool = pool;
    this.viewAllStaff = this.viewAllStaff.bind(this);
    this.viewStaffById = this.viewStaffById.bind(this);
    this.getStaffByEmail = this.getStaffByEmail.bind(this);
    this.getStaffByName = this.getStaffByName.bind(this);
    this.createStaff = this.createStaff.bind(this);
    this.updateStaff = this.updateStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
  }

  async viewAllStaff(starting, display) {
    const sql = `
      SELECT staffname, avatar
      FROM nobsc_staff
      ORDER BY staffname ASC
      LIMIT ?, ?
    `;
    const [ allStaff ] = await this.pool.execute(sql, [starting, display]);
    if (!allStaff) throw new Error("viewAllStaff failed");
    return allStaff;
  }

  async viewStaffById(staffId) {
    const sql = `
      SELECT staffname, avatar
      FROM nobsc_staff
      WHERE staff_id = ?
    `;
    const [ staff ] = await this.pool.execute(sql, [staffId]);
    if (!staff) throw new Error("viewStaffById failed");
    return staff;
  }

  async getStaffByEmail(email) {
    const sql = `
      SELECT staff_id, email, pass, staffname
      FROM nobsc_staff
      WHERE email = ?
    `;
    const [ staffByEmail ] = await this.pool.execute(sql, [email]);
    if (!staffByEmail) throw new Error("getStaffByEmail failed");
    return staffByEmail;
  }

  async getStaffByName(staffname) {
    const sql = `
      SELECT staff_id, email, pass, staffname
      FROM nobsc_staff
      WHERE staffname = ?
    `;
    const [ staffByName ] = await this.pool.execute(sql, [staffname]);
    if (!staffByName) throw new Error("getStaffByName failed");
    return staffByName;
  }

  async createStaff(staffInfo) {
    const { email, password, staffname, avatar, plan } = staffInfo;
    const sql = `
      INSERT INTO nobsc_staff
      (email, pass, staffname, avatar, plan)
      VALUES
      (?, ?, ?, ?, ?)
    `;  // plan must be valid JSON
    const [ createdStaff ] = await this.pool.execute(sql, [email, password, staffname, avatar, plan]);
    if (!createdStaff) throw new Error("createdStaff failed");
    return createdStaff;
  }

  async updateStaff(staffInfo) {
    const { staffId, email, password, staffname, avatar } = staffInfo;
    const sql = `
      UPDATE nobsc_staff
      SET email = ?, pass = ?, staffname = ?, avatar = ?
      WHERE staff_id = ?
      LIMIT 1
    `;
    const [ updatedStaff ] = await this.pool.execute(sql, [email, password, staffname, avatar, staffId]);
    if (!updatedStaff) throw new Error("updateStaff failed");
    return updatedStaff;
  }

  async deleteStaff(staffId) {
    const sql = `
      DELETE
      FROM nobsc_staff
      WHERE staff_id = ?
      LIMIT 1
    `;
    const [ deletedStaff ] = await this.pool.execute(sql, [staffId]);
    if (!deletedStaff) throw new Error("deleteStaff failed");
    return deletedStaff;
  }
}

module.exports = Staff;