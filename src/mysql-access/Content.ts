import { Pool, RowDataPacket } from 'mysql2/promise';

export class Content implements IContent {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewContentById = this.viewContentById.bind(this);
    this.createContent = this.createContent.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.deleteContent = this.deleteContent.bind(this);
  }

  async viewContentById(contentId: number) {  // also make ByDate, ByTitle, ByAuthor, ByDateTitle, etc.
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
    contentItems
  }: ICreatingContent) {
    const sql = `
      INSERT INTO nobsc_content
      (content_type_id, author_id, owner_id, created, published, content_items)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ createdContent ] = await this.pool.execute<RowDataPacket[]>(sql, [
      contentTypeId,
      authorId,
      ownerId,
      created,
      published,
      contentItems
    ]);
    return createdContent;
  }

  async updateContent({
    contentId,
    ownerId,
    contentTypeId,
    published,
    contentItems
  }: IUpdatingContent) {
    const sql = `
      UPDATE nobsc_content
      SET content_type_id = ?, published = ?, content_items = ?
      WHERE owner_id = ? AND content_id = ?
      LIMIT 1
    `;
    const [ updatedContent ] = await this.pool.execute<RowDataPacket[]>(sql, [
      contentTypeId,
      published,
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
      WHERE owner_id = ? AND ingredient_id = ?
      LIMIT 1
    `;
    const [ deletedContent ] = await this.pool
    .execute<RowDataPacket[]>(sql, [ownerId, contentId]);
    return deletedContent;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IContent {
  pool: Pool;
  viewContentById(contentId: number): Data;
  createContent({
    contentTypeId,
    authorId,
    ownerId,
    created,
    published,
    contentItems
  }: ICreatingContent): Data;
  updateContent({
    contentId,
    ownerId,
    contentTypeId,
    published,
    contentItems
  }: IUpdatingContent): Data;
  deleteContent(ownerId: number, contentId: number): Data;
}

interface ICreatingContent {
  contentTypeId: number;
  authorId: number;
  ownerId: number;
  created: string;
  published: string | null;
  contentItems: IContentItem[];
}

interface IUpdatingContent {
  contentId: number;
  ownerId: number;
  contentTypeId: number;
  published: string | null;
  contentItems: IContentItem[];
}

// change to match Slate values
interface IContentItem {
  index: number
  key: string
  element: string
  attributes: (object|null)
  children: (IContentItem|string|number|null)
}