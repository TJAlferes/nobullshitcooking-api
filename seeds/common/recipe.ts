import type { PoolConnection } from 'mysql2/promise';

import { images }             from '../production/recipe/generated-images.js';
import { recipes }            from '../production/recipe/generated-recipes.js';
import { recipe_images }      from '../production/recipe/generated-recipe-images.js';
import { recipe_equipment }   from '../production/recipe/generated-recipe-equipments.js';
import { recipe_ingredients } from '../production/recipe/generated-recipe-ingredients.js';
import { recipe_methods }     from '../production/recipe/generated-recipe-methods.js';

export async function seedRecipe(conn: PoolConnection) {
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

  const placeholders2 = '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?),'
    .repeat(recipes.length)
    .slice(0, -1);
  const sql2 = `
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
    ) VALUES ${placeholders2}
  `;
  await conn.query(sql2, recipes);

  const placeholders3 = '(?, ?, ?)'.repeat(recipe_images.length).slice(0, -1);
  const sql3 = `
    INSERT INTO recipe_image (
      recipe_id,
      image_id,
      type
    ) VALUES ${placeholders3}
  `;
  await conn.query(sql3, recipe_images);

  const placeholders4 = '(?, ?, ?)'.repeat(recipe_equipment.length).slice(0, -1);
  const sql4 = `
    INSERT INTO recipe_equipment (
      recipe_id,
      amount,
      equipment_id
    ) VALUES ${placeholders4}
  `;
  await conn.query(sql4, recipe_equipment);

  const placeholders5 = '(?, ?, ?, ?)'.repeat(recipe_ingredients.length).slice(0, -1);
  const sql5 = `
    INSERT INTO recipe_ingredient (
      recipe_id,
      amount,
      unit_id,
      ingredient_id
    ) VALUES ${placeholders5}
  `;
  await conn.query(sql5, recipe_ingredients);

  const placeholders6 = '(?, ?)'.repeat(recipe_methods.length).slice(0, -1);
  const sql6 = `
    INSERT INTO recipe_method (
      recipe_id,
      method_id
    ) VALUES ${placeholders6}
  `;
  await conn.query(sql6, recipe_methods);
}
