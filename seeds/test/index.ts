import { createPool } from 'mysql2/promise';

import { testConfig }     from '../../src/connections/mysql.js';
import { seedEquipment }  from './equipment/seed.js';
import { seedIngredient } from './ingredient/seed.js';
import { seedPlan }       from './plan/seed.js';
import { seedRecipe }     from './recipe/seed.js';
import { seedUser }       from './user/seed.js';

// Runs between each integration test
export async function seedTestDatabase() {
  const pool = createPool(testConfig);
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    console.log(`seedTestDatabase begin`);
    await seedUser(conn);
    await seedEquipment(conn);
    await seedIngredient(conn);
    await seedRecipe(conn);
    await seedPlan(conn);
    console.log(`seedTestDatabase success`);
    await conn.commit();
  } catch (err) {
    console.error('seedTestDatabase fail:', err);
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
    await pool.end();
  }
}
