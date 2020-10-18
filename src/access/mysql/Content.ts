import { Pool, RowDataPacket } from 'mysql2/promise';

export class Content implements IContent {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getLinksByType = this.getLinksByType.bind(this);
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getLinksByType(type: string) {
    const author = "NOBSC";
    const sql = `
      SELECT id, type, published, title
      FROM content
      WHERE author = ? AND type = ? AND published IS NOT NULL
    `;
    const [ rows ] = await this.pool
      .execute<RowDataPacket[]>(sql, [author, type]);
    return rows;
  }

  // TO DO: finish
  async view(author: string) {
    const sql = `
      SELECT id, type, author, created, published, title, items
      FROM content
      WHERE author = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [author]);
    return row;
  }

  // TO DO: also make ByDate, ByAuthor, etc.
  async viewById(id: string, author: string) {
    const sql = `SELECT type, items FROM content WHERE id = ? AND author = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id, author]);
    return row;
  }

  async create({
    type,
    author,
    owner,
    created,
    published,
    title,
    items
  }: ICreatingContent) {
    const sql = `
      INSERT INTO content (
        type,
        author,
        owner,
        created,
        published,
        title,
        items
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      type,
      author,
      owner,
      created,
      published,
      title,
      items
    ]);
    return row;
  }

  async update({
    id,
    owner,
    type,
    published,
    title,
    items
  }: IUpdatingContent) {
    const sql = `
      UPDATE content
      SET type = ?, published = ?, title = ?, items = ?
      WHERE owner = ? AND id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      type,
      published,
      title,
      items,
      owner,
      id
    ]);
    return row;
  }

  async delete(owner: string, id: string) {
    const sql = `DELETE FROM content WHERE owner = ? AND id = ? LIMIT 1`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [owner, id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IContent {
  pool: Pool;
  getLinksByType(type: string): Data;
  view(author: string): Data;
  viewById(id: string, author: string): Data;
  create({
    type,
    author,
    owner,
    created,
    published,
    title,
    items
  }: ICreatingContent): Data;
  update({
    id,
    owner,
    type,
    published,
    title,
    items
  }: IUpdatingContent): Data;
  delete(owner: string, id: string): Data;
}

interface ICreatingContent {
  type: string;
  author: string;
  owner: string;
  created: string;
  published: string | null;
  title: string;
  items: any[];
}

interface IUpdatingContent {
  id: string;
  owner: string;
  type: string;
  published: string | null;
  title: string;
  items: any[];
}