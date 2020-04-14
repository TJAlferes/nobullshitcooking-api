import { Pool } from 'mysql2/promise';

interface IContent {
  contentTypeId: number
  authorId: number
  ownerId: number
  created: Date
  published: (Date|undefined)
  contentItems: IContentItem[]
}

interface IContentUpdate {
  contentTypeId: number
  published: (Date|undefined)
  contentItems: IContentItem[]
}

interface IContentItem {
  index: number
  key: string
  element: string
  attributes: (object|undefined)
  children: (IContentItem|string|number|undefined)
}

export class Content {
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
      SELECT content_items
      FROM nobsc_content
      WHERE content_id = ?
    `;
    const [ content ] = await this.pool.execute(sql, [contentId]);
    return content;
  }

  async createContent({
    contentTypeId,
    authorId,
    ownerId,
    created,
    published,
    contentItems
  }: IContent) {
    const sql = `
      INSERT INTO nobsc_content
      (content_type_id, author_id, owner_id, created, published, content_items)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [ createdContent ] = await this.pool.execute(sql, [
      contentTypeId,
      authorId,
      ownerId,
      created,
      published,
      contentItems
    ]);
    return createdContent;
  }

  async updateContent(
    {
      contentTypeId,
      published,
      contentItems
    }: IContentUpdate,
    ownerId: number,
    contentId: number
  ) {
    const sql = `
      UPDATE nobsc_content
      SET content_type_id = ?, published = ?, content_items = ?
      WHERE owner_id = ? AND content_id = ?
      LIMIT 1
    `;
    const [ updatedContent ] = await this.pool.execute(sql, [
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
    .execute(sql, [ownerId, contentId]);
    return deletedContent;
  }
}