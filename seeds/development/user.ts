import type { PoolConnection } from 'mysql2/promise';

import { images }      from '../production/user/generated-images.js';
import { users }       from '../production/user/generated-users.js';
import { user_images } from '../production/user/generated-user-images.js';

export async function seedUser(conn: PoolConnection) {
  const placeholders1 = '(?, ?, ?, ?, ?),'.repeat(images.length).slice(0, -1);
  const sql1 = `
    INSERT INTO image (
      image_id,
      image_filename,
      caption,
      author_id,
      owner_id
    ) VALUES ${placeholders1}
  `;
  await conn.query(sql1, images);

  const placeholders2 = '(?, ?, ?, ?, ?),'.repeat(users.length).slice(0, -1);
  const sql2 = `
    INSERT INTO user (
      user_id,
      email,
      password,
      username,
      confirmation_code
    ) VALUES ${placeholders2}
  `;
  await conn.query(sql2, users);

  const placeholders3 = '(?, ?, ?),'.repeat(users.length).slice(0, -1);
  const sql3 = `
    INSERT INTO user_image (
      user_id,
      image_id,
      current
    ) VALUES ${placeholders3}
  `;
  await conn.query(sql3, user_images);
}
