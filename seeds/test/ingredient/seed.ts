import type { PoolConnection } from 'mysql2/promise';

import { production_images } from '../../production/ingredient/images.js';
import { production_ingredients } from '../../production/ingredient/ingredients.js';
import { test_images } from './images.js';
import { test_ingredients } from './ingredients.js';

const images = [...production_images, ...test_images];
const ingredients = [...production_ingredients, ...test_ingredients];

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
