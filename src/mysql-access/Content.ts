import { Pool } from 'mysql2/promise';

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

  async createContent({}) {

  }

  async updateContent({}) {

  }

  async deleteContent(ownerId: number, contentId: number) {

  }
}