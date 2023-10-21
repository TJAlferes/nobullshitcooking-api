import type { PoolConnection } from 'mysql2/promise';
import { uuidv7 } from 'uuidv7';

import { NOBSC_USER_ID } from '../src/modules/shared/model.js';

//import { images } from '../prod/ingredient/generated-images.js';
import { ingredients } from '../prod/ingredient/generated-ingredients.js';

export async function seedIngredient(conn: PoolConnection) {
  // TO DO: seed image table here first

  const placeholders = '(?, ?, ?, ?, ?, ?, ?),'.repeat(ingredients.length).slice(0, -1);

  const sql1 = `
    INSERT INTO ingredient (
      ingredient_id,
      ingredient_type_id,
      owner_id,
      ingredient_variety,
      ingredient_name,
      notes,
      image_id
    ) VALUES ${placeholders}
  `;

  await conn.query(sql1, ingredients);

  // also insert a branded ingredient
  await conn.query(`
    INSERT INTO ingredient (
      ingredient_id,
      ingredient_type_id,
      owner_id,
      ingredient_brand,
      ingredient_name,
      notes,
      image_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `, {
    ingredient_id:      uuidv7(),
    ingredient_type_id: 18,
    owner_id:           NOBSC_USER_ID,
    ingredient_brand:   "Tobasco",
    ingredient_name:    "Hot Sauce",
    notes:              "",
    image_id:           "tobasco-hot-sauce"
  });
}
