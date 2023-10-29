import { createPool } from 'mysql2/promise';

import { developmentConfig } from '../../src/connections/mysql.js';
import { seedEquipment }     from '../shared/equipment.js';
import { seedIngredient }    from '../shared/ingredient.js';
import { seedRecipe }        from '../shared/recipe.js';

export async function seedDevelopmentDatabase() {
  const pool = createPool(developmentConfig);
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    console.log(`seedDevelopmentDatabase begin`);
    //await seedStaff(conn);
    //await seedUser(conn);
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
  }
}
