import { createPool } from 'mysql2/promise';

import { testConfig } from '../../src/connections/mysql';
import { seedEquipment } from './equipment/seed';
import { seedIngredient } from './ingredient/seed';
import { seedPlan } from './plan/seed';
import { seedRecipe } from './recipe/seed';
import { seedUser } from './user/seed';

// Runs before each integration test in test environment
// along with tests/integration/index.test.ts truncateTestDatabase,
// so tests have clean slate
export async function seedTestDatabase() {
  const pool = createPool(testConfig);
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    //console.log(`seedTestDatabase begin`);
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
