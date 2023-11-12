import type { PoolConnection } from 'mysql2/promise';

import { production_images as images } from '../../production/user/images.js';
import { production_user_images } from '../../production/user/user-images.js';
import { production_users } from '../../production/user/users.js';
import { test_user_images } from './user-images.js';
import { test_users } from './users.js';
import { test_password_resets } from './password-resets.js';

const users = [...production_users, ...test_users];
const user_images = [...production_user_images, ...test_user_images];

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

  const placeholders3 = '(?, ?, ?),'.repeat(user_images.length).slice(0, -1);
  const sql3 = `
    INSERT INTO user_image (
      user_id,
      image_id,
      current
    ) VALUES ${placeholders3}
  `;
  await conn.query(sql3, user_images);

  const placeholders4 = '(?, ?, ?),'.repeat(user_images.length).slice(0, -1);
  const sql4 = `
    INSERT INTO password_reset (
      reset_id,
      user_id,
      temporary_password
    ) VALUES ${placeholders4}
  `;
  await conn.query(sql4, test_password_resets);
}
