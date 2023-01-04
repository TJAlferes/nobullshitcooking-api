import { Pool, RowDataPacket } from 'mysql2/promise';

export class Content implements IContent {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getLinksByContentTypeName = this.getLinksByContentTypeName.bind(this);
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
  }

  async getLinksByContentTypeName(contentTypeName: string) {
    const authorId = 1;
    const sql = `
      SELECT
        c.id,
        c.content_type_id,
        t.name AS content_type_name,
        c.published,
        c.title
      FROM content c
      INNER JOIN content_types t ON c.content_type_id = t.id
      WHERE
        c.author_id = ? AND
        t.name = ? AND
        c.published IS NOT NULL
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [authorId, contentTypeName]);
    return rows;
  }

  // TO DO: finish
  async view(authorId: number) {
    const sql = `
      SELECT
        id,
        content_type_id,
        author_id,
        created,
        published,
        title,
        items
      FROM content
      WHERE author_id = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [authorId]);
    return row;
  }

  // TO DO: also make ByDate, ByAuthor, etc.
  async viewById(id: number, authorId: number) {
    const sql = `SELECT content_type_id, items FROM content WHERE id = ? AND author_id = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id, authorId]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IContent {
  pool: Pool;
  getLinksByContentTypeName(contentTypeName: string): Data;
  view(authorId: number): Data;
  viewById(id: number, authorId: number): Data;
}