import { createPool } from 'mysql2/promise';

import { testConfig }     from '../../src/connections/mysql.js';
import { seedEquipment }  from '../common/equipment.js';
import { seedIngredient } from '../common/ingredient.js';
import { seedRecipe }     from '../common/recipe.js';
import { seedUser }       from '../test/user.js';

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
    console.log(`seedTestDatabase success`);
    await conn.commit();
  } catch (err) {
    console.error('seedTestDatabase fail:', err);
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
