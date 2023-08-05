import { Pool, RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from './MySQL';

export class RecipeEquipmentRepo extends MySQLRepo implements IRecipeEquipmentRepo {
  async viewByRecipeId(id: number) {
    const sql = `
      SELECT re.amount, e.name AS equipment_name
      FROM recipe_equipment re
      INNER JOIN equipment e ON e.id = re.equipment_id
      WHERE re.recipe_id = ?
      ORDER BY e.equipment_type_id
    `;
    const [ rows ] = await this.pool.execute<RecipeEquipment[]>(sql, [id]);
    return rows;
  }

  async create(placeholders: string, recipeEquipment: number[]) {
    const sql = `INSERT INTO recipe_equipment (recipe_id, amount, equipment_id) VALUES ${placeholders}`;
    await this.pool.execute(sql, recipeEquipment);
  }

  async update(recipeId: number, placeholders: string, recipeEquipment: number[]) {
    const sql1 = `DELETE FROM recipe_equipment WHERE recipe_id = ?`;
    const sql2 = recipeEquipment.length ? `INSERT INTO recipe_equipment (recipe_id, amount, equipment_id) VALUES ${placeholders}` : undefined;
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();
    try {
      // Rather than updating current values in the database, we delete them...
      await conn.query(sql1, [recipeId]);
      // ... and, if there are new values, we insert them.
      if (sql2) {
        await conn.query(sql2, recipeEquipment);
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async deleteByEquipmentId(id: number) {
    const sql = `DELETE FROM recipe_equipment WHERE equipment_id = ?`;
    await this.pool.execute(sql, [id]);
  }

  async deleteByRecipeId(id: number) {
    const sql = `DELETE FROM recipe_equipment WHERE recipe_id = ?`;
    await this.pool.execute(sql, [id]);
  }

  async deleteByRecipeIds(ids: number[]) {
    const sql = `DELETE FROM recipe_equipment WHERE recipe_id = ANY(?)`;
    await this.pool.execute(sql, ids);
  }
}

export interface IRecipeEquipmentRepo {
  pool:                Pool;
  viewByRecipeId:      (id: number) =>                                                        Promise<RecipeEquipment[]>;
  create:              (placeholders: string, recipeEquipment: number[]) =>                   Promise<void>;
  update:              (recipeId: number, placeholders: string, recipeEquipment: number[]) => Promise<void>;
  deleteByEquipmentId: (id: number) =>                                                        Promise<void>;
  deleteByRecipeId:    (id: number) =>                                                        Promise<void>;
  deleteByRecipeIds:   (ids: number[]) =>                                                     Promise<void>;
}

export type MakeRecipeEquipment = {
  amount: number;
  id:     number;
};

type RecipeEquipment = RowDataPacket & {
  amount:         number;
  equipment_name: string;
};
