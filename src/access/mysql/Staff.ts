import { Pool, RowDataPacket } from 'mysql2/promise';

export class Staff implements IStaff {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getByEmail = this.getByEmail.bind(this);
    this.getByName = this.getByName.bind(this);
    this.view = this.view.bind(this);
    this.viewByName = this.viewByName.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getByEmail(email: string) {
    const sql = `
      SELECT staffname, email, pass, avatar FROM staff WHERE email = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [email]);
    return row;
  }

  async getByName(staffname: string) {
    const sql = `
      SELECT staffname, email, pass, avatar FROM staff WHERE staffname = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [staffname]);
    return row;
  }

  async view(starting: number, display: number) {
    const sql = `
      SELECT staffname, avatar FROM staff ORDER BY staffname ASC LIMIT ?, ?
    `;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, [starting, display]);
    return rows;
  }

  async viewByName(staffname: string) {
    const sql = `SELECT staffname, avatar FROM staff WHERE staffname = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [staffname]);
    return row;
  }

  async create({ email, pass, staffname }: ICreatingStaff) {
    const sql = `INSERT INTO staff (email, pass, staffname) VALUES (?, ?, ?)`;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [email, pass, staffname]);
    return row;
  }

  async update({ email, pass, staffname, avatar }: IUpdatingStaff) {
    const sql = `
      UPDATE staff
      SET email = ?, pass = ?, staffname = ?, avatar = ?
      WHERE staffname = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [email, pass, staffname, avatar]);
    return row;
  }

  async delete(staffname: string) {
    const sql = `DELETE FROM staff WHERE staffname = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [staffname]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IStaff {
  pool: Pool;
  getByEmail(email: string): Data;
  getByName(staffname: string): Data;
  view(starting: number, display: number): Data;
  viewByName(staffname: string): Data;
  create({email, pass, staffname}: ICreatingStaff): Data;
  update({email, pass, staffname, avatar}: IUpdatingStaff): Data;
  delete(staffname: string): Data;
}

interface ICreatingStaff {
  email: string;
  pass: string;
  staffname: string;
}

interface IUpdatingStaff extends ICreatingStaff {
  avatar: string;
}