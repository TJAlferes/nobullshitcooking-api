import { ResultSetHeader, RowDataPacket } from 'mysql2';

import { NOBSC_USER_ID, UNKNOWN_USER_ID } from '../shared/model';
import { MySQLRepo } from '../shared/MySQL';

export class ImageRepo extends MySQLRepo implements ImageRepoInterface {
  async viewOne(image_id: string) {
    const sql = `
      SELECT
        image_id,
        image_filename,
        caption,
        author_id,
        owner_id
      FROM image
      WHERE image_id = ?
    `;
    const [ [ row ] ] = await this.pool.execute<ImageView[]>(sql, [image_id]);
    return row;
  }

  async bulkInsert({ placeholders, images }: BulkInsertParams) {
    const flat = images.flatMap(({
      image_id,
      image_filename,
      caption,
      author_id,
      owner_id
    }) => ([
      image_id,
      image_filename,
      caption,
      author_id,
      owner_id
    ]));
    const sql = `
      INSERT INTO image (image_id, image_filename, caption, author_id, owner_id)
      VALUES ${placeholders}
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, flat);
    //if (result.affectedRows < 1) throw new Error('Query not successful.');
    return result.affectedRows >= 1;
  }

  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO image (image_id, image_filename, caption, author_id, owner_id)
      VALUES (:image_id, :image_filename, :caption, :author_id, :owner_id)
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async update(params: UpdateParams) {
    const sql = `
      UPDATE image
      SET
        image_filename = :image_filename,
        caption        = :caption
      WHERE image_id = :image_id
      LIMIT 1
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, params);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async unattributeAll(author_id: string) {
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
    await this.pool.execute(sql, {
      unknown_user_id,
      author_id,
      owner_id
    });
    // log instead
    //if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async unattributeOne({ author_id, image_id }: UnattributeOneParams) {
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
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, {
      unknown_user_id,
      author_id,
      owner_id,
      image_id
    });
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteAll(owner_id: string) {
    if (owner_id === NOBSC_USER_ID || owner_id === UNKNOWN_USER_ID) {
      return;
    }
    const sql = `DELETE FROM image WHERE owner_id = ?`;
    await this.pool.execute(sql, [owner_id]);
    // log instead
    //if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteOne({ owner_id, image_id }: DeleteOneParams) {
    const sql = `
      DELETE FROM image
      WHERE owner_id = ? AND image_id = ?
      LIMIT 1
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [owner_id, image_id]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
}

export interface ImageRepoInterface {
  viewOne:        (image_id: string) =>             Promise<ImageView>;
  bulkInsert:     (params: BulkInsertParams) =>     Promise<boolean>;
  insert:         (params: InsertParams) =>         Promise<void>;
  update:         (params: UpdateParams) =>         Promise<void>;
  unattributeAll: (author_id: string) =>            Promise<void>;
  unattributeOne: (params: UnattributeOneParams) => Promise<void>;
  deleteAll:      (owner_id: string) =>             Promise<void>;
  deleteOne:      (params: DeleteOneParams) =>      Promise<void>;
}

type ImageView = RowDataPacket & {
  image_id:       string;
  image_filename: string;
  caption:        string;
  author_id:      string;
  owner_id:       string;
};

type BulkInsertParams = {
  placeholders: string;
  images:       InsertParams[];
};

type InsertParams = {
  image_id:       string;
  image_filename: string;
  caption:        string;
  author_id:      string;
  owner_id:       string;
};

type UpdateParams = InsertParams;

type UnattributeOneParams = {
  image_id:  string;
  author_id: string;
};

type DeleteOneParams = {
  image_id: string;
  owner_id: string;
};
