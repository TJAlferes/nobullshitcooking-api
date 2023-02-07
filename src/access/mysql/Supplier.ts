import { Pool, RowDataPacket } from 'mysql2/promise';

export class Supplier implements ISupplier {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewAll =   this.viewAll.bind(this);
    this.viewOne =   this.viewOne.bind(this);
    this.create =    this.create.bind(this);
    this.update =    this.update.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  async viewAll() {
    const sql = `SELECT id, name FROM suppliers`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    return rows;
  }

  async viewOne(id: number) {
    const sql = `SELECT id, name FROM suppliers WHERE id = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }

  async create(name: string) {
    const sql = `INSERT INTO suppliers (name) VALUES (?)`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [name]);
    return row;
  }

  async update(id: number, name: string) {
    const sql = `UPDATE suppliers SET name = ? WHERE id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [name, id]);
    return row;
  }

  async deleteOne(id: number) {
    const sql = `DELETE FROM suppliers WHERE id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ISupplier {
  viewAll():                        Data;
  viewOne(id: number):              Data;
  create(name: string):             Data;
  update(id: number, name: string): Data;
  deleteOne(id: number):            Data;
}