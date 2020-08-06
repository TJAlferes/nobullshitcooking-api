import { Pool, RowDataPacket } from 'mysql2/promise';

export class Content implements IContent {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getLinksByContentTypeName = this.getLinksByContentTypeName.bind(this);
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteAllByOwnerId = this.deleteAllByOwnerId.bind(this);
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
    const [ rows ] = await this.pool
    .execute<RowDataPacket[]>(sql, [authorId, contentTypeName]);
    return rows;
  }

  // TO DO: finish
  async view(authorId: number) {
    const sql = `
      SELECT

      FROM content
      WHERE author_id = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [authorId]);
    return row;
  }

  // TO DO: also make ByDate, ByAuthor, etc.
  async viewById(id: number) {
    const sql = `
      SELECT content_type_id, items
      FROM content
      WHERE id = ?
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }

  async create({
    contentTypeId,
    authorId,
    ownerId,
    created,
    published,
    title,
    items
  }: ICreatingContent) {
    const sql = `
      INSERT INTO content (
        content_type_id,
        author_id,
        owner_id,
        created,
        published,
        title,
        items
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      contentTypeId,
      authorId,
      ownerId,
      created,
      published,
      title,
      items
    ]);
    return row;
  }

  async update({
    id,
    ownerId,
    contentTypeId,
    published,
    title,
    items
  }: IUpdatingContent) {
    const sql = `
      UPDATE content
      SET content_type_id = ?, published = ?, title = ?, items = ?
      WHERE owner_id = ? AND id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [
      contentTypeId,
      published,
      title,
      items,
      ownerId,
      id
    ]);
    return row;
  }

  async delete(ownerId: number, id: number) {
    const sql = `
      DELETE
      FROM content
      WHERE owner_id = ? AND id = ?
      LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [ownerId, id]);
    return row;
  }

  async deleteAllByOwnerId(ownerId: number) {
    const sql = `DELETE FROM content WHERE owner_id = ?`;
    await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IContent {
  pool: Pool;
  getLinksByContentTypeName(contentTypeName: string): Data;
  view(authorId: number): Data;
  viewById(id: number, authorId: number): Data;
  create({
    contentTypeId,
    authorId,
    ownerId,
    created,
    published,
    title,
    items
  }: ICreatingContent): Data;
  update({
    id,
    ownerId,
    contentTypeId,
    published,
    title,
    items
  }: IUpdatingContent): Data;
  delete(ownerId: number, id: number): Data;
  deleteAllByOwnerId(ownerId: number): void;
}

interface ICreatingContent {
  contentTypeId: number;
  authorId: number;
  ownerId: number;
  created: string;
  published: string | null;
  title: string;
  items: any[];
}

interface IUpdatingContent {
  id: number;
  ownerId: number;
  contentTypeId: number;
  published: string | null;
  title: string;
  items: any[];
}