import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from "../../shared/MySQL";

export class UserImageRepo extends MySQLRepo implements UserImageRepoInterface {
  async insert(user_image: UserImageRow) {
    const sql = `
      INSERT INTO user_image (user_id, image_id, current)
      VALUES (:user_id, :image_id, :current)
    `;
    await this.pool.execute(sql, user_image);
  }

  async update(user_image: UserImageRow) {
    const sql = `
      UPDATE user_image
      SET current = :current
      WHERE user_id = :user_id AND image_id = :image_id
    `;
    await this.pool.execute(sql, user_image);
  }
}

export interface UserImageRepoInterface {
  //viewAllByUserId:     (user_id: string) => Promise<UserImageView[]>;
  //viewCurrentByUserId: (user_id: string) => Promise<UserImageView[]>;
  insert: (user_image: UserImageRow) => Promise<void>;
  update: (user_image: UserImageRow) => Promise<void>;
}

type UserImageRow = {
  user_id:  string;
  image_id: string;
  current:  boolean;
};

//type UserImageView = RowDataPacket & {};
