import { pool }           from "../src/connections/mysql.js";
import { seedEquipment }  from './equipment.js';
import { seedIngredient } from "./ingredient.js";
import { seedRecipe }     from "./recipe.js";

async function seedDatabase() {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    console.log(`seedDatabase begin`);

    await seedEquipment(conn);
    await seedIngredient(conn);
    await seedRecipe(conn);
    //await seedRecipeEquipment(conn);
    //await seedRecipeIngredient(conn);
    //await seedRecipeMethod(conn);
    //await seedRecipeSubrecipe(conn);

    console.log(`seedDatabase success`);
    await conn.commit();
  } catch (err) {
    console.error('seedDatabase fail:', err);
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

seedDatabase();
