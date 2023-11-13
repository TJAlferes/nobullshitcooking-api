import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL';

export class UserImageRepo extends MySQLRepo implements UserImageRepoInterface {
  async viewAll(user_id: string) {
    const sql = `
      SELECT
        ui.image_id,
        i.author_id,
        i.image_filename
      FROM user_image ui
      INNER JOIN image i ON i.image_id = ui.image_id
      WHERE ui.user_id = ?
    `;
    const [ rows ] = await this.pool.execute<UserImageView[]>(sql, user_id);
    return rows;
  }

  async viewCurrent(user_id: string): Promise<UserImageView | undefined> {
    const sql = `
      SELECT
        ui.image_id,
        i.author_id,
        i.image_filename
      FROM user_image ui
      INNER JOIN image i ON i.image_id = ui.image_id
      WHERE ui.user_id = ? AND ui.current = true
    `;
    const [ [ row ] ] = await this.pool.execute<UserImageView[]>(sql, user_id);
    return row ? row : undefined;
  }

  async insert({ user_id, image_id, current }: InsertParams) {
    const sql = `
      INSERT INTO user_image (user_id, image_id, current)
      VALUES (:user_id, :image_id, :current)
    `;
    await this.pool.execute(sql, {user_id, image_id, current});
  }

  async setCurrent({ user_id, image_id }: SetCurrentParams) {
    const sql1 = `
      UPDATE user_image
      SET current = false
      WHERE user_id = ? AND current = true
    `;
    await this.pool.execute(sql1, user_id);

    const sql2 = `
      UPDATE user_image
      SET current = true
      WHERE image_id = ?
    `;
    await this.pool.execute(sql2, image_id);
  }
}

export interface UserImageRepoInterface {
  viewAll:     (user_id: string) =>          Promise<UserImageView[]>;
  viewCurrent: (user_id: string) =>          Promise<UserImageView | undefined>;
  insert:      (params: InsertParams) =>     Promise<void>;
  setCurrent:  (params: SetCurrentParams) => Promise<void>;
}

type UserImageView = RowDataPacket & {
  image_id:       string;
  author_id:      string;
  image_filename: string;
};

type InsertParams = {
  user_id:  string;
  image_id: string;
  current:  boolean;
};

type SetCurrentParams = {
  user_id:  string;
  image_id: string;
};
