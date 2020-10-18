import { Pool, RowDataPacket } from 'mysql2/promise';

export class Supplier implements ISupplier {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewByName = this.viewByName.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async view() {
    const sql = `SELECT name FROM suppliers`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    return rows;
  }

  async viewByName(name: string) {
    const sql = `SELECT name FROM suppliers WHERE name = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [name]);
    return row;
  }

  async create(name: string) {
    const sql = `INSERT INTO suppliers (name) VALUES (?)`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [name]);
    return row;
  }

  async update(name: string) {
    const sql = `UPDATE suppliers SET name = ? WHERE name = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [name]);
    return row;
  }

  async delete(name: string) {
    const sql = `DELETE FROM suppliers WHERE name = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [name]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ISupplier {
  view(): Data;
  viewByName(name: string): Data;
  create(name: string): Data;
  update(name: string): Data;
  delete(name: string): Data;
}