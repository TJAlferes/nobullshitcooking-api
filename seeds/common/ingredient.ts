import type { PoolConnection } from 'mysql2/promise';

import { images }      from '../production/ingredient/generated-images.js';
import { ingredients } from '../production/ingredient/generated-ingredients.js';

export async function seedIngredient(conn: PoolConnection) {
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

  const placeholders2 = '(?, ?, ?, ?, ?, ?, ?),'.repeat(ingredients.length).slice(0, -1);
  const sql2 = `
    INSERT INTO ingredient (
      ingredient_id,
      ingredient_type_id,
      owner_id,
      ingredient_variety,
      ingredient_name,
      notes,
      image_id
    ) VALUES ${placeholders2}
  `;
  await conn.query(sql2, ingredients);
}
