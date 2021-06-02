import { Pool, RowDataPacket } from 'mysql2/promise';

export class Staff implements IStaff {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getByEmail = this.getByEmail.bind(this);  // sensitive
    this.getByName = this.getByName.bind(this);  // sensitive
    this.viewById = this.viewById.bind(this);
    this.viewByName = this.viewByName.bind(this);
    this.create = this.create.bind(this);
    this.verify = this.verify.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getByEmail(email: string) {
    const sql = `
      SELECT id, email, pass, staffname, confirmation_code
      FROM staff
      WHERE email = ?
    `;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [email]);
    return row;
  }

  async getByName(staffname: string) {
    const sql = `
      SELECT id, email, pass, staffname, confirmation_code
      FROM staff
      WHERE staffname = ?
    `;
    const [ [ row ] ] =
      await this.pool.execute<RowDataPacket[]>(sql, [staffname]);
    return row;
  }

  async viewById(id: number) {
    const sql = `SELECT staffname FROM staff WHERE id = ?`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }

  async viewByName(staffname: string) {
    const sql = `SELECT id FROM staff WHERE staffname = ?`;
    const [ [ row ] ] =
      await this.pool.execute<RowDataPacket[]>(sql, [staffname]);
    return row;
  }

  async create({ email, pass, staffname, confirmationCode }: ICreatingStaff) {
    const sql = `
      INSERT INTO staff (email, pass, staffname, confirmation_code)
      VALUES (?, ?, ?, ?)
    `;
    const [ [ row ] ] = await this.pool
      .execute<RowDataPacket[]>(sql, [email, pass, staffname, confirmationCode]);
    return row;
  }

  async verify(email: string) {
    const sql =
      `UPDATE staff SET confirmation_code = NULL WHERE email = ? LIMIT 1`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [email]);
    return row;
  }

  async update({ id, email, pass, staffname }: IUpdatingStaff) {
    const sql = `
      UPDATE staff
      SET email = ?, pass = ?, staffname = ?
      WHERE id = ?
      LIMIT 1
    `;
    const [ [ row ] ] = await this.pool
      .execute<RowDataPacket[]>(sql, [email, pass, staffname, id]);
    return row;
  }

  async delete(id: number) {
    const sql = `DELETE FROM staff WHERE id = ? LIMIT 1`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }
}

type Row = Promise<RowDataPacket>;

export interface IStaff {
  pool: Pool;
  getByEmail(email: string): Row;
  getByName(staffname: string): Row;
  viewById(id: number): Row;
  viewByName(username: string): Row;
  create(staff: ICreatingStaff): Row;
  verify(email: string): Row;
  update(staff: IUpdatingStaff): Row;
  delete(id: number): Row;
}

interface ICreatingStaff {
  email: string;
  pass: string;
  staffname: string;
  confirmationCode: string;
}

interface IUpdatingStaff {
  id: number;
  email: string;
  pass: string;
  staffname: string;
}