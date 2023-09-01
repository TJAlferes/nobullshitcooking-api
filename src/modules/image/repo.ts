import { NOBSC_USER_ID, UNKNOWN_USER_ID } from '../shared/model';
import { MySQLRepo }                      from '../shared/MySQL';

export class ImageRepo extends MySQLRepo implements ImageRepoInterface {
  async bulkInsert({ placeholders, images }: BulkInsertParams) {
    const sql = `
      INSERT INTO recipe_ingredient (image_id, image_url, alt_text, caption)
      VALUES ${placeholders}
    `;
    await this.pool.execute(sql, images);
  }

  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO image (image_id, image_url, alt_text, caption)
      VALUES (:image_id, :image_url, :alt_text, :caption)
    `;
    await this.pool.execute(sql, params);
  }

  async update(params: InsertParams) {
    const sql = `
      UPDATE image
      SET
        image_url = :image_url,
        alt_text  = :alt_text,
        caption   = :caption
      WHERE image_id = :image_id
      LIMIT 1
    `;
    await this.pool.execute(sql, params);
  }

  // TO DO: change this name. you're not actually disowning, you're unauthoring
  async disownAll(author_id: string) {
    // TO DO: move to service
    if (author_id === NOBSC_USER_ID || author_id === UNKNOWN_USER_ID) {
      return;
    }

    const owner_id        = NOBSC_USER_ID;
    const unknown_user_id = UNKNOWN_USER_ID;

    const sql = `
      UPDATE image
      SET author_id = :unknown_user_id
      WHERE
            author_id = :author_id
        AND owner_id  = :owner_id
    `;
    await this.pool.execute(sql, {unknown_user_id, author_id, owner_id});
  }

  // TO DO: change this name. you're not actually disowning, you're unauthoring
  async disownOne({ author_id, image_id }: DisownOneParams) {
    // TO DO: move to service
    if (author_id === NOBSC_USER_ID || author_id === UNKNOWN_USER_ID) {
      return;
    }

    const owner_id        = NOBSC_USER_ID;
    const unknown_user_id = UNKNOWN_USER_ID;

    const sql = `
      UPDATE image
      SET author_id = :unknown_user_id
      WHERE
            author_id = :author_id
        AND owner_id  = :owner_id
        AND image_id = :image_id
    `;
    await this.pool.execute(sql, {unknown_user_id, author_id, owner_id, image_id});
  }

  async deleteOne({ owner_id, image_id }: DeleteOneParams) {
    const sql = `
      DELETE FROM image
      WHERE owner_id = ? AND image_id = ?
      LIMIT 1
    `;
    await this.pool.execute(sql, [owner_id, image_id]);
  }
}

export interface ImageRepoInterface {
  bulkInsert: (params: BulkInsertParams) => Promise<void>;
  insert:     (params: InsertParams) =>     Promise<void>;
  update:     (params: UpdateParams) =>     Promise<void>;
  disownAll:  (author_id: string) =>        Promise<void>;
  disownOne:  (params: DisownOneParams) =>  Promise<void>;
  deleteOne:  (params: DeleteOneParams) =>  Promise<void>;
}

type BulkInsertParams = {
  placeholders: string;
  images:       InsertParams[];
};

type InsertParams = {
  image_id:  string;
  image_url: string;
  alt_text:  string;
  caption:   string;
};

type UpdateParams = InsertParams;

type DisownOneParams = {
  image_id:  string;
  author_id: string;
};

type DeleteOneParams = {
  image_id: string;
  owner_id: string;
};
