import { createPool } from 'mysql2/promise';

import { productionConfig } from '../../src/connections/mysql';
import { seedEquipment } from '../common/equipment';
import { seedIngredient } from '../common/ingredient';
import { seedRecipe } from '../common/recipe';
import { seedUser } from '../common/user';

export async function seedProductionDatabase() {  // Must run only ONCE, delete this file after
  const pool = createPool(productionConfig);
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    console.log(`seedProductionDatabase begin`);
    await seedUser(conn);
    await seedEquipment(conn);
    await seedIngredient(conn);
    await seedRecipe(conn);
    console.log(`seedProductionDatabase success`);
    await conn.commit();
  } catch (err) {
    console.error('seedProductionDatabase fail:', err);
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
    await pool.end();
  }
}
