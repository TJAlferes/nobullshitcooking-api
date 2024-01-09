import type { PoolConnection, ResultSetHeader } from 'mysql2/promise';

import { format } from '../../common/format';
import { production_images } from '../../production/user/images.js';
import { production_user_images } from '../../production/user/user-images.js';
import { production_users } from '../../production/user/users';
import { test_images } from './images';
import { test_user_images } from './user-images.js';
import { test_users } from './users';
import { test_password_resets } from './password-resets.js';

const users = [...production_users, ...test_users];
const images = [...production_images, ...test_images];
const user_images = [...production_user_images, ...test_user_images];

export async function seedUser(conn: PoolConnection) {
  const placeholders1 = '(?, ?, ?, ?, ?),'.repeat(users.length).slice(0, -1);
  const sql1 = `
    INSERT INTO user (
      user_id,
      email,
      password,
      username,
      confirmation_code
    ) VALUES ${placeholders1}
  `;
  const [ res1 ] = await conn.execute<ResultSetHeader>(sql1, format(users));
  if (res1.affectedRows < 1) throw new Error('Seed failure.');

  const placeholders2 = '(?, ?, ?, ?, ?),'.repeat(images.length).slice(0, -1);
  const sql2 = `
    INSERT INTO image (
      image_id,
      image_filename,
      caption,
      author_id,
      owner_id
    ) VALUES ${placeholders2}
  `;
  await conn.execute(sql2, format(images));

  const placeholders3 = '(?, ?, ?),'.repeat(user_images.length).slice(0, -1);
  const sql3 = `
    INSERT INTO user_image (
      user_id,
      image_id,
      current
    ) VALUES ${placeholders3}
  `;
  await conn.execute(sql3, format(user_images));

  const placeholders4 = '(?, ?, ?),'.repeat(test_password_resets.length).slice(0, -1);
  const sql4 = `
    INSERT INTO password_reset (
      reset_id,
      user_id,
      temporary_password
    ) VALUES ${placeholders4}
  `;
  await conn.execute(sql4, format(test_password_resets));
}
