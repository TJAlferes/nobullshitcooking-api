import type { PoolConnection } from 'mysql2/promise';

import { NOBSC_USER_ID }      from '../src/modules/shared/model.js';
import { images }             from './prod/recipe/generated-images.js';
import { recipes }            from './prod/recipe/generated-recipes.js';
import { recipe_images }      from './prod/recipe/generated-recipe-images.js';
import { recipe_equipment }   from './prod/recipe/generated-recipe-equipments.js';
import { recipe_ingredients } from './prod/recipe/generated-recipe-ingredients.js';
import { recipe_methods }     from './prod/recipe/generated-recipe-methods.js';

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
