import { Pool, RowDataPacket } from 'mysql2/promise';

export class ContentType implements IContentType {
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
    const sql = `SELECT name, parent, path FROM content_types`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    return rows;
  }

  async viewByName(name: string) {
    const sql = `SELECT name, parent, path FROM content_types WHERE name = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [name]);
    return row;
  }

  async create({ name, parent, path }: ICreatingContentType) {
    const sql =
      `INSERT INTO content_types (name, parent, path) VALUES (?, ?, ?)`;
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql, [name, parent, path]);
    return row;
  }

  async update({ name, parent, path }: IUpdatingContentType) {
    const sql = `
      UPDATE content_types
      SET name = ?, parent = ?, path = ?
      WHERE name = ?
      LIMIT 1
    `;
    const [ row ] =
      await this.pool.execute<RowDataPacket[]>(sql, [name, parent, path]);
    return row;
  }

  async delete(name: string) {
    const sql = `DELETE FROM content_types WHERE name = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [name]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IContentType {
  pool: Pool;
  view(): Data;
  viewByName(name: string): Data;
  create({name, parent, path}: ICreatingContentType): Data;
  update({name, parent, path}: IUpdatingContentType): Data;
  delete(name: string): Data;
}

interface ICreatingContentType {
  name: string;
  parent: string;
  path: string;
}

interface IUpdatingContentType {
  name: string;
  parent: string;
  path: string;
}