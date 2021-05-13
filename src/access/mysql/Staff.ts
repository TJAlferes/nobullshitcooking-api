import { Pool, RowDataPacket } from 'mysql2/promise';

export class Staff implements IStaff {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getByEmail = this.getByEmail.bind(this);
    this.getByName = this.getByName.bind(this);
    //this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getByEmail(email: string) {
    const sql = `SELECT staffname, email, pass FROM staff WHERE email = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [email]);
    return row;
  }

  async getByName(staffname: string) {
    const sql = `SELECT staffname, email, pass FROM staff WHERE staffname = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [staffname]);
    return row;
  }

  /*async view(starting: number, display: number) {
    const sql = `SELECT staffname FROM staff ORDER BY staffname ASC LIMIT ?, ?`;
    const [ rows ] =
      await this.pool.execute<RowDataPacket[]>(sql, [starting, display]);
    return rows;
  }*/

  async viewById(id: number) {
    const sql = `SELECT staffname FROM staff WHERE staff_id = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }

  async create({ email, pass, staffname }: ICreatingStaff) {
    const sql = `INSERT INTO staff (email, pass, staffname) VALUES (?, ?, ?)`;
    const [ row ] =
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
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [email, pass, staffname, id]);
    return row;
  }

  async delete(id: number) {
    const sql = `DELETE FROM staff WHERE id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IStaff {
  pool: Pool;
  getByEmail(email: string): Data;
  getByName(staffname: string): Data;
  //view(starting: number, display: number): Data;
  viewById(id: number): Data;
  create(staff: ICreatingStaff): Data;
  update(staff: IUpdatingStaff): Data;
  delete(id: number): Data;
}

interface ICreatingStaff {
  email: string;
  pass: string;
  staffname: string;
}

interface IUpdatingStaff extends ICreatingStaff {
  id: number;
}