import type { PoolConnection } from 'mysql2/promise';
import { uuidv7 } from 'uuidv7';

import { NOBSC_USER_ID } from '../src/modules/shared/model.js';

const data = [
  ["11111111-1111-1111-1111-111111111111", 3,  3,  "Grilled Chicken and Seasoned Rice", "Yum",       "01:00:00", "02:00:00", "Marinate chicken in a..."],
  ["21111111-1111-1111-1111-111111111111", 6,  6,  "Fish and Potato Soup",              "Nice",      "00:45:00", "01:00:00", "Heat stock..."],
  ["31111111-1111-1111-1111-111111111111", 7,  7,  "Greek Salad",                       "Who Knows", "00:08:00", "00:08:00", "Mix olive oil and red wine vinegar in bowl..."],
  ["41111111-1111-1111-1111-111111111111", 8,  8,  "Irish Guinness Beef Stew",          "Calming",   "00:45:00", "04:00:00", "Sear well just one side of the beef pieces..."],
  ["51111111-1111-1111-1111-111111111111", 11, 11, "Carrot Ginger Dressing",            "Tasty",     "00:20:00", "00:20:00", "Blend carrots and..."],
];

export const recipes = data.map(([
  recipe_type_id,
  cuisine_id,
  title,
  description,
  active_time,
  total_time,
  directions
]) => ({
  recipe_id:      uuidv7(),
  recipe_type_id: recipe_type_id as number,
  cuisine_id:     cuisine_id as number,
  author_id:      NOBSC_USER_ID,
  owner_id:       NOBSC_USER_ID,
  title:          title as string,
  description:    description as string,
  active_time:    active_time as string,
  total_time:     total_time as string,
  directions:     directions as string
}));

export async function seedRecipe(conn: PoolConnection) {
  const placeholders = '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?),'
    .repeat(recipes.length)
    .slice(0, -1);

  const sql = `
    INSERT INTO recipe (
      recipe_id,
      recipe_type_id,
      cuisine_id,
      author_id,
      owner_id,
      title,
      description,
      active_time,
      total_time,
      directions
    ) VALUES ${placeholders}
  `;

  await conn.query(sql, recipes);
}
