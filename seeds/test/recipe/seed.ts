import type { PoolConnection } from 'mysql2/promise';

import { format } from '../../common/format';
import { production_images } from '../../production/recipe/images.js';
import { production_recipes } from '../../production/recipe/recipes.js';
import { production_recipe_images } from '../../production/recipe/recipe-images.js';
import { production_recipe_equipment } from '../../production/recipe/recipe-equipment.js';
import { production_recipe_ingredients } from '../../production/recipe/recipe-ingredients.js';
import { production_recipe_methods } from '../../production/recipe/recipe-methods.js';
import { test_images } from './images.js';
import { test_recipes } from './recipes.js';
import { test_recipe_images } from './recipe-images.js';
import { test_recipe_equipment } from './recipe-equipment.js'
import { test_recipe_ingredients } from './recipe-ingredients.js'
import { test_recipe_methods } from './recipe-methods.js'
import { test_favorite_recipes } from './favorite-recipes.js';
import { test_saved_recipes } from './saved-recipes.js';

const images = [...production_images, ...test_images ];
const recipes = [...production_recipes, ...test_recipes ];
const recipe_images = [...production_recipe_images, ...test_recipe_images];
const recipe_equipment = [...production_recipe_equipment, ...test_recipe_equipment];
const recipe_ingredients = [...production_recipe_ingredients, ...test_recipe_ingredients];
const recipe_methods = [...production_recipe_methods, ...test_recipe_methods];

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
  await conn.execute(sql1, format(images));

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
  await conn.execute(sql2, format(recipes));

  const placeholders3 = '(?, ?, ?)'.repeat(recipe_images.length).slice(0, -1);
  const sql3 = `
    INSERT INTO recipe_image (
      recipe_id,
      image_id,
      type
    ) VALUES ${placeholders3}
  `;
  await conn.execute(sql3, format(recipe_images));

  const placeholders4 = '(?, ?, ?)'.repeat(recipe_equipment.length).slice(0, -1);
  const sql4 = `
    INSERT INTO recipe_equipment (
      recipe_id,
      amount,
      equipment_id
    ) VALUES ${placeholders4}
  `;
  await conn.execute(sql4, format(recipe_equipment));

  const placeholders5 = '(?, ?, ?, ?)'.repeat(recipe_ingredients.length).slice(0, -1);
  const sql5 = `
    INSERT INTO recipe_ingredient (
      recipe_id,
      amount,
      unit_id,
      ingredient_id
    ) VALUES ${placeholders5}
  `;
  await conn.execute(sql5, format(recipe_ingredients));

  const placeholders6 = '(?, ?)'.repeat(recipe_methods.length).slice(0, -1);
  const sql6 = `
    INSERT INTO recipe_method (
      recipe_id,
      method_id
    ) VALUES ${placeholders6}
  `;
  await conn.execute(sql6, format(recipe_methods));

  const placeholders7 = '(?, ?),'.repeat(test_favorite_recipes.length).slice(0, -1);
  const sql7 = `
    INSERT INTO favorite_recipes (
      user_id,
      recipe_id
    ) VALUES ${placeholders7}
  `;
  await conn.execute(sql7, format(test_favorite_recipes));

  const placeholders8 = '(?, ?),'.repeat(test_saved_recipes.length).slice(0, -1);
  const sql8 = `
    INSERT INTO saved_recipes (
      user_id,
      recipe_id
    ) VALUES ${placeholders8}
  `;
  await conn.execute(sql8, format(test_saved_recipes));
}
