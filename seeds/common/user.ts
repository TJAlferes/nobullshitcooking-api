import type { PoolConnection } from 'mysql2/promise';

import { production_images } from '../production/user/images.js';
import { production_users } from '../production/user/users.js';
import { production_user_images } from '../production/user/user-images.js';
import { format } from './format';

export async function seedUser(conn: PoolConnection) {
  const placeholders1 = '(?, ?, ?, ?, ?),'.repeat(production_images.length).slice(0, -1);
  const sql1 = `
    INSERT INTO image (
      image_id,
      image_filename,
      caption,
      author_id,
      owner_id
    ) VALUES ${placeholders1}
  `;
  await conn.execute(sql1, format(production_images));

  const placeholders2 = '(?, ?, ?, ?, ?),'.repeat(production_users.length).slice(0, -1);
  const sql2 = `
    INSERT INTO user (
      user_id,
      email,
      password,
      username,
      confirmation_code
    ) VALUES ${placeholders2}
  `;
  await conn.execute(sql2, format(production_users));

  const placeholders3 = '(?, ?, ?),'.repeat(production_users.length).slice(0, -1);
  const sql3 = `
    INSERT INTO user_image (
      user_id,
      image_id,
      current
    ) VALUES ${placeholders3}
  `;
  await conn.execute(sql3, format(production_user_images));
}
