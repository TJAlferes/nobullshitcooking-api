import type { PoolConnection } from 'mysql2/promise';

import { NOBSC_USER_ID }      from '../src/modules/shared/model.js';
import { images }             from './prod/recipe/generated-images.js';
import { recipes }            from './prod/recipe/generated-recipes.js';
import { recipe_images }      from './prod/recipe/generated-recipe-images.js';
import { recipe_equipment }   from './prod/recipe/generated-recipe-equipment.js';
import { recipe_ingredients } from './prod/recipe/generated-recipe-ingredients.js';
import { recipe_methods }     from './prod/recipe/generated-recipe-methods.js';
import { recipe_subrecipes }  from './prod/recipe/generated-recipe-subrecipes.js';

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

/*
INSERT INTO recipe_equipment (recipe_id, amount, equipment_id) VALUES
("11111111-1111-1111-1111-111111111111", 1, 1),
("21111111-1111-1111-1111-111111111111", 1, 1),
("31111111-1111-1111-1111-111111111111", 1, 1),
("41111111-1111-1111-1111-111111111111", 1, 1),
("51111111-1111-1111-1111-111111111111", 1, 1);

INSERT INTO recipe_ingredient (recipe_id, amount, unit_id, ingredient_id) VALUES
("11111111-1111-1111-1111-111111111111", 1,  3,  153),
("21111111-1111-1111-1111-111111111111", 1,  6,  176),
("31111111-1111-1111-1111-111111111111", 3,  7,  142),
("41111111-1111-1111-1111-111111111111", 1,  8,  230),
("51111111-1111-1111-1111-111111111111", 10, 1,  122);

INSERT INTO recipe_method (recipe_id, method_id) VALUES
("11111111-1111-1111-1111-111111111111", 13),
("21111111-1111-1111-1111-111111111111", 7),
("31111111-1111-1111-1111-111111111111", 4),
("41111111-1111-1111-1111-111111111111", 3),
("51111111-1111-1111-1111-111111111111", 12);
*/
