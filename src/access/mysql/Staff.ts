import { Pool, RowDataPacket } from 'mysql2/promise';

export class Staff implements IStaff {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getByEmail = this.getByEmail.bind(this);
    this.getByName = this.getByName.bind(this);
    this.viewById = this.viewById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  // sensitive
  async getByEmail(email: string) {
    const sql = `SELECT id, email, pass, staffname FROM staff WHERE email = ?`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [email]);
    return row;
  }

  // sensitive
  async getByName(staffname: string) {
    const sql =
      `SELECT id, email, pass, staffname FROM staff WHERE staffname = ?`;
    const [ [ row ] ] =
      await this.pool.execute<RowDataPacket[]>(sql, [staffname]);
    return row;
  }

  async viewById(id: number) {
    const sql = `SELECT staffname FROM staff WHERE id = ?`;
    const [ [ row ] ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }

  async create({ email, pass, staffname }: ICreatingStaff) {
    const sql = `INSERT INTO staff (email, pass, staffname) VALUES (?, ?, ?)`;
    const [ [ row ] ] =
      await this.pool.execute<RowDataPacket[]>(sql, [email, pass, staffname]);
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
  create(staff: ICreatingStaff): Row;
  update(staff: IUpdatingStaff): Row;
  delete(id: number): Row;
}

interface ICreatingStaff {
  email: string;
  pass: string;
  staffname: string;
}

interface IUpdatingStaff extends ICreatingStaff {
  id: number;
}