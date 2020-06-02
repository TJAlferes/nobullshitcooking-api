import { Pool, RowDataPacket } from 'mysql2/promise';

export class Staff implements IStaff {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getStaffByEmail = this.getStaffByEmail.bind(this);
    this.getStaffByName = this.getStaffByName.bind(this);
    this.viewAllStaff = this.viewAllStaff.bind(this);
    this.viewStaffById = this.viewStaffById.bind(this);
    this.createStaff = this.createStaff.bind(this);
    this.updateStaff = this.updateStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
  }

  async getStaffByEmail(email: string) {
    const sql = `
      SELECT staff_id, email, pass, staffname
      FROM nobsc_staff
      WHERE email = ?
    `;
    const [ staffByEmail ] = await this.pool
    .execute<RowDataPacket[]>(sql, [email]);
    return staffByEmail;
  }

  async getStaffByName(staffname: string) {
    const sql = `
      SELECT staff_id, email, pass, staffname
      FROM nobsc_staff
      WHERE staffname = ?
    `;
    const [ staffByName ] = await this.pool
    .execute<RowDataPacket[]>(sql, [staffname]);
    return staffByName;
  }

  async viewAllStaff(starting: number, display: number) {
    const sql = `
      SELECT staffname, avatar
      FROM nobsc_staff
      ORDER BY staffname ASC
      LIMIT ?, ?
    `;
    const [ allStaff ] = await this.pool
    .execute<RowDataPacket[]>(sql, [starting, display]);
    return allStaff;
  }

  async viewStaffById(staffId: number) {
    const sql = `
      SELECT staffname, avatar
      FROM nobsc_staff
      WHERE staff_id = ?
    `;
    const [ staff ] = await this.pool.execute<RowDataPacket[]>(sql, [staffId]);
    return staff;
  }

  async createStaff({ email, pass, staffname }: ICreatingStaff) {
    const sql = `
      INSERT INTO nobsc_staff (email, pass, staffname)
      VALUES (?, ?, ?)
    `;
    const [ createdStaff ] = await this.pool
    .execute<RowDataPacket[]>(sql, [email, pass, staffname]);
    return createdStaff;
  }

  async updateStaff({
    staffId,
    email,
    pass,
    staffname,
    avatar
  }: IUpdatingStaff) {
    const sql = `
      UPDATE nobsc_staff
      SET email = ?, pass = ?, staffname = ?, avatar = ?
      WHERE staff_id = ?
      LIMIT 1
    `;
    const [ updatedStaff ] = await this.pool
    .execute<RowDataPacket[]>(sql, [email, pass, staffname, avatar, staffId]);
    return updatedStaff;
  }

  async deleteStaff(staffId: number) {
    const sql = `
      DELETE
      FROM nobsc_staff
      WHERE staff_id = ?
      LIMIT 1
    `;
    const [ deletedStaff ] = await this.pool
    .execute<RowDataPacket[]>(sql, [staffId]);
    return deletedStaff;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IStaff {
  pool: Pool;
  getStaffByEmail(email: string): Data;
  getStaffByName(staffname: string): Data;
  //getStaffIdByStaffname(staffname: string): Data;
  viewAllStaff(starting: number, display: number): Data;
  viewStaffById(staffId: number): Data;
  createStaff({ email, pass, staffname }: ICreatingStaff): Data;
  //setAvatar(avatar: string, staffId: number): Data;
  updateStaff({
    staffId,
    email,
    pass,
    staffname,
    avatar
  }: IUpdatingStaff): Data;
  deleteStaff(userId: number): Data;
}

interface ICreatingStaff {
  email: string;
  pass: string;
  staffname: string;
}

interface IUpdatingStaff {
  staffId: number;
  email: string;
  pass: string;
  staffname: string;
  avatar: string;
}