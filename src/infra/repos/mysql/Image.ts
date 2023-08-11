import { MySQLRepo } from './MySQL';

export class ImageRepo extends MySQLRepo implements IImageRepo {
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

  async delete(image_id: string) {
    const sql = `DELETE FROM image WHERE image_id = ? LIMIT 1`;
    await this.pool.execute(sql, [image_id]);
  }
}

interface IImageRepo {
  insert: (params: InsertParams) => Promise<void>;
  update: (params: InsertParams) => Promise<void>;
  delete: (image_id: string) =>     Promise<void>;
}

type InsertParams = {
  image_id:  string;
  image_url: string;
  alt_text:  string;
  caption:   string;
};
