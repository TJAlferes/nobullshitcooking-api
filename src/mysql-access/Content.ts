import { Pool, RowDataPacket } from 'mysql2/promise';

export class Content implements IContent {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getContentLinksByTypeName = this.getContentLinksByTypeName.bind(this);
    this.viewContent = this.viewContent.bind(this);
    this.viewContentById = this.viewContentById.bind(this);
    this.createContent = this.createContent.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.deleteContent = this.deleteContent.bind(this);
    this.deleteAllMyContent = this.deleteAllMyContent.bind(this);
  }

  async getContentLinksByTypeName(contentTypeName: string) {
    const authorId = 1;
    const sql = `
      SELECT
        c.content_id,
        c.content_type_id,
        t.content_type_name,
        c.published,
        c.title
      FROM nobsc_content c
      INNER JOIN nobsc_content_types t ON c.content_type_id = t.content_type_id
      WHERE
        c.author_id = ? AND
        t.content_type_name = ? AND
        c.published IS NOT NULL
    `;
    const [ contentLinks ] = await this.pool
    .execute<RowDataPacket[]>(sql, [authorId, contentTypeName]);
    return contentLinks;
  }

  async viewContent(authorId: number) {
    const sql = `
      SELECT

      FROM nobsc_content
      WHERE author_id = ?
    `;
    const [ content ] = await this.pool
    .execute<RowDataPacket[]>(sql, [authorId]);
    return content;
  }

  // TO DO: also make ByDate, ByAuthor, etc.
  async viewContentById(contentId: number) {
    const sql = `
      SELECT content_type_id, content_items
      FROM nobsc_content
      WHERE content_id = ?
    `;
    const [ content ] = await this.pool
    .execute<RowDataPacket[]>(sql, [contentId]);
    return content;
  }

  async createContent({
    contentTypeId,
    authorId,
    ownerId,
    created,
    published,
    title,
    contentItems
  }: ICreatingContent) {
    const sql = `
      INSERT INTO nobsc_content (
        content_type_id,
        author_id,
        owner_id,
        created,
        published,
        title,
        content_items
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ createdContent ] = await this.pool.execute<RowDataPacket[]>(sql, [
      contentTypeId,
      authorId,
      ownerId,
      created,
      published,
      title,
      contentItems
    ]);
    return createdContent;
  }

  async updateContent({
    contentId,
    ownerId,
    contentTypeId,
    published,
    title,
    contentItems
  }: IUpdatingContent) {
    const sql = `
      UPDATE nobsc_content
      SET content_type_id = ?, published = ?, title = ?, content_items = ?
      WHERE owner_id = ? AND content_id = ?
      LIMIT 1
    `;
    const [ updatedContent ] = await this.pool.execute<RowDataPacket[]>(sql, [
      contentTypeId,
      published,
      title,
      contentItems,
      ownerId,
      contentId
    ]);
    return updatedContent;
  }

  async deleteContent(ownerId: number, contentId: number) {
    const sql = `
      DELETE
      FROM nobsc_content
      WHERE owner_id = ? AND content_id = ?
      LIMIT 1
    `;
    const [ deletedContent ] = await this.pool
    .execute<RowDataPacket[]>(sql, [ownerId, contentId]);
    return deletedContent;
  }

  async deleteAllMyContent(ownerId: number) {
    const sql = `
      DELETE
      FROM nobsc_content
      WHERE owner_id = ?
    `;
    await this.pool.execute<RowDataPacket[]>(sql, [ownerId]);
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IContent {
  pool: Pool;
  getContentLinksByTypeName(contentTypeName: string): Data;
  viewContent(authorId: number): Data;
  viewContentById(contentId: number, authorId: number): Data;
  createContent({
    contentTypeId,
    authorId,
    ownerId,
    created,
    published,
    title,
    contentItems
  }: ICreatingContent): Data;
  updateContent({
    contentId,
    ownerId,
    contentTypeId,
    published,
    title,
    contentItems
  }: IUpdatingContent): Data;
  deleteContent(ownerId: number, contentId: number): Data;
  deleteAllMyContent(ownerId: number): void;
}

interface ICreatingContent {
  contentTypeId: number;
  authorId: number;
  ownerId: number;
  created: string;
  published: string | null;
  title: string;
  contentItems: any[];
}

interface IUpdatingContent {
  contentId: number;
  ownerId: number;
  contentTypeId: number;
  published: string | null;
  title: string;
  contentItems: any[];
}