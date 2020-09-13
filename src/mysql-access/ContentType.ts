import { Pool, RowDataPacket } from 'mysql2/promise';

export class ContentType implements IContentType {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async view() {
    const sql = `SELECT id, parent_id, name, path FROM nobsc_content_types`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    //await this.pool.end();
    return rows;
  }

  async viewById(id: number) {
    const sql = `
      SELECT id, parent_id, name, path FROM content_types WHERE id = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    //await this.pool.end();
    return row;
  }

  async create({ parentId, name, path }: ICreatingContentType) {
    const sql = `
      INSERT INTO content_types (parent_id, name, path) VALUES (?, ?, ?)
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [parentId, name, path]);
    //await this.pool.end();
    return row;
  }

  async update({ id, parentId, name, path }: IUpdatingContentType) {
    const sql = `
      UPDATE content_types
      SET parent_id = ?, name = ?, path = ?
      WHERE id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [parentId, name, path, id]);
    //await this.pool.end();
    return row;
  }

  async delete(id: number) {
    const sql = `DELETE FROM content_types WHERE id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    //await this.pool.end();
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IContentType {
  pool: Pool;
  view(): Data;
  viewById(id: number): Data;
  create({parentId, name, path}: ICreatingContentType): Data;
  update({id, parentId, name, path}: IUpdatingContentType): Data;
  delete(id: number): Data;
}

interface ICreatingContentType {
  parentId: number;
  name: string;
  path: string;
}

interface IUpdatingContentType extends ICreatingContentType {
  id: number;
}