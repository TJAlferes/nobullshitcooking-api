import { Pool, RowDataPacket } from 'mysql2/promise';

export class ContentType implements IContentType {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewContentTypes = this.viewContentTypes.bind(this);
    this.viewContentTypeById = this.viewContentTypeById.bind(this);
    this.createContentType = this.createContentType.bind(this);
    this.updateContentType = this.updateContentType.bind(this);
    this.deleteContentType = this.deleteContentType.bind(this);
  }

  async viewContentTypes() {
    const sql = `
      SELECT content_type_id, parent_id, content_type_name, content_type_path
      FROM nobsc_content_types
    `;
    const [ allContentTypes ] = await this.pool.execute<RowDataPacket[]>(sql);
    return allContentTypes;
  }

  async viewContentTypeById(contentTypeId: number) {
    const sql = `
      SELECT content_type_id, parent_id, content_type_name, content_type_path
      FROM nobsc_content_types
      WHERE content_type_id = ?
    `;
    const [ contentType ] = await this.pool
    .execute<RowDataPacket[]>(sql, [contentTypeId]);
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
    .execute<RowDataPacket[]>(sql, [
      parentId,
      contentTypeName,
      contentTypePath
    ]);
    return createdContentType;
  }

  async updateContentType({
    contentTypeId,
    parentId,
    contentTypeName,
    contentTypePath
  }: IUpdatingContentType) {
    const sql = `
      UPDATE nobsc_content_types
      SET
        parent_id = ?,
        content_type_name = ?,
        content_type_path = ?
      WHERE content_type_id = ?
      LIMIT 1
    `;
    const [ updatedContentType ] = await this.pool
    .execute<RowDataPacket[]>(sql, [
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
    .execute<RowDataPacket[]>(sql, [contentTypeId]);
    return deletedContentType;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IContentType {
  pool: Pool;
  viewContentTypes(): Data;
  viewContentTypeById(contentTypeId: number): Data;
  createContentType({
    parentId,
    contentTypeName,
    contentTypePath
  }: ICreatingContentType): Data;
  updateContentType({
    contentTypeId,
    parentId,
    contentTypeName,
    contentTypePath
  }: IUpdatingContentType): Data;
  deleteContentType(contentTypeId: number): Data;
}

interface ICreatingContentType {
  parentId: number;
  contentTypeName: string;
  contentTypePath: string;
}

interface IUpdatingContentType extends ICreatingContentType {
  contentTypeId: number;
}