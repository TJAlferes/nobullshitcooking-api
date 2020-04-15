import { Pool } from 'mysql2/promise';

export class ContentType {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async viewAllContentTypes() {
    const sql = `
      SELECT content_type_id, content_type_name
      FROM nobsc_content_types
    `;
    const [ allContentTypes ] = await this.pool.execute(sql);
    return allContentTypes;
  }

  async viewContentTypeById(contentTypeId: number) {
    const sql = `
      SELECT content_type_id, content_type_name
      FROM nobsc_content_types
      WHERE content_type_id = ?
    `;
    const [ contentType ] = await this.pool.execute(sql, [contentTypeId]);
    return contentType;
  }
}