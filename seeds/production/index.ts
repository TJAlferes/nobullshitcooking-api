import { createPool } from 'mysql2/promise';

import { productionConfig } from '../../src/connections/mysql.js';
import { seedEquipment }    from '../shared/equipment.js';
import { seedIngredient }   from '../shared/ingredient.js';
import { seedRecipe }       from '../shared/recipe.js';

// Must run only ONCE
export async function seedProductionDatabase() {
  const pool = createPool(productionConfig);
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    console.log(`seedProductionDatabase begin`);
    //await seedStaff(conn);
    //await seedUser(conn);
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
  }
}
