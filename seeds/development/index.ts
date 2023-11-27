import { createPool } from 'mysql2/promise';

import { developmentConfig } from '../../src/connections/mysql';
import { seedEquipment } from '../common/equipment';
import { seedIngredient } from '../common/ingredient';
import { seedRecipe } from '../common/recipe';
import { seedUser } from '../common/user';

// Runs before server startup in development environment,
// so developers can play around with example data
export async function seedDevelopmentDatabase() {
  const pool = createPool(developmentConfig);
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    console.log(`seedDevelopmentDatabase begin`);
    await seedUser(conn);
    await seedEquipment(conn);
    await seedIngredient(conn);
    await seedRecipe(conn);
    console.log(`seedDevelopmentDatabase success`);
    await conn.commit();
  } catch (err) {
    console.error('seedDevelopmentDatabase fail:', err);
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
    await pool.end();
  }
}
