import { Pool, RowDataPacket } from 'mysql2/promise';

export class Supplier implements ISupplier {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view =     this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.create =   this.create.bind(this);
    this.update =   this.update.bind(this);
    this.delete =   this.delete.bind(this);
  }

  async view() {
    const sql = `SELECT id, name FROM suppliers`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    return rows;
  }

  async viewById(id: number) {
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

  async delete(id: number) {
    const sql = `DELETE FROM suppliers WHERE id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ISupplier {
  view(): Data;
  viewById(id: number): Data;
  create(name: string): Data;
  update(id: number, name: string): Data;
  delete(id: number): Data;
}