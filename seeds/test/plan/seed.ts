import type { PoolConnection } from 'mysql2/promise';

import { test_plan_recipes } from './plan-recipes.js';
import { test_plans } from './plans.js';

export async function seedPlan(conn: PoolConnection) {
  const placeholders1 = '(?, ?, ?, ?),'.repeat(test_plans.length).slice(0, -1);
  const sql1 = `
    INSERT INTO plan (
      plan_id,
      author_id,
      owner_id,
      plan_name
    ) VALUES ${placeholders1}
  `;
  await conn.query(sql1, test_plans);

  const placeholders2 = '(?, ?, ?, ?),'.repeat(test_plan_recipes.length).slice(0, -1);
  const sql2 = `
    INSERT INTO plan_recipe (
      plan_id,
      recipe_id,
      day_number,
      recipe_number
    ) VALUES ${placeholders2}
  `;
  await conn.query(sql2, test_plan_recipes);
}
