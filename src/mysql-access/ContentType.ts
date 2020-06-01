import { Pool } from 'mysql2/promise';

interface ICreatingContentType {
  parentId: number;
  contentTypeName: string;
  contentTypePath: string;
}

interface IEditingContentType extends ICreatingContentType {
  contentTypeId: number;
}

export class ContentType {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewAllContentTypes = this.viewAllContentTypes.bind(this);
    this.viewContentTypeById = this.viewContentTypeById.bind(this);
    this.createContentType = this.createContentType.bind(this);
    this.updateContentType = this.updateContentType.bind(this);
    this.deleteContentType = this.deleteContentType.bind(this);
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

  async createContentType({
    parentId,
    contentTypeName,
    contentTypePath
  }: ICreatingContentType) {
    const sql = `
      INSERT INTO nobsc_content_types
      (parent_id, content_type_name, content_type_path)
      VALUES (?, ?, ?)
    `;
    const [ createdContentType ] = await this.pool
    .execute(sql, [parentId, contentTypeName, contentTypePath]);
    return createdContentType;
  }

  async updateContentType({
    contentTypeId,
    parentId,
    contentTypeName,
    contentTypePath
  }: IEditingContentType) {
    const sql = `
      UPDATE nobsc_content_types
      SET
        parent_id = ?,
        content_type_name = ?,
        content_type_path = ?
      WHERE content_type_id = ?
      LIMIT 1
    `;
    const [ updatedContentType ] = await this.pool.execute(sql, [
      contentTypeId,
      parentId,
      contentTypeName,
      contentTypePath
    ]);
    return updatedContentType;
  }

  async deleteContentType(contentTypeId: number) {
    const sql = `
      DELETE
      FROM nobsc_content_types
      WHERE content_type_id = ?
      LIMIT 1
    `;
    const [ deletedContentType ] = await this.pool
    .execute(sql, [contentTypeId]);
    return deletedContentType;
  }
}