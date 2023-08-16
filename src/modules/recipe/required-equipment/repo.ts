import { RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from './MySQL';

export class RecipeEquipmentRepo extends MySQLRepo implements IRecipeEquipmentRepo {
  async viewByRecipeId(recipe_id: string) {
    const sql = `
      SELECT re.amount, e.equipment_name
      FROM recipe_equipment re
      INNER JOIN equipment e ON e.equipment_id = re.equipment_id
      WHERE re.recipe_id = ?
      ORDER BY e.equipment_type_id
    `;
    const [ rows ] = await this.pool.execute<RecipeEquipmentView[]>(sql, [recipe_id]);
    return rows;
  }

  async insert({ placeholders, recipe_equipment }: InsertParams) {  // TO DO: change to namedPlaceholders using example below
    const sql = `INSERT INTO recipe_equipment (recipe_id, amount, equipment_id) VALUES ${placeholders}`;
    await this.pool.execute(sql, recipe_equipment);
  }

  async update({ recipe_id, placeholders, recipe_equipment }: UpdateParams) {  // TO DO: change to namedPlaceholders using example below
    const sql1 = `DELETE FROM recipe_equipment WHERE recipe_id = ?`;
    const sql2 = recipe_equipment.length ? `INSERT INTO recipe_equipment (recipe_id, amount, equipment_id) VALUES ${placeholders}` : undefined;
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();
    try {
      // Rather than updating current values in the database, we delete them...
      await conn.query(sql1, [recipe_id]);
      // ... and, if there are new values, we insert them.
      if (sql2) {
        await conn.query(sql2, recipe_equipment);
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async deleteByEquipmentId(equipment_id: string) {
    const sql = `DELETE FROM recipe_equipment WHERE equipment_id = ?`;
    await this.pool.execute(sql, [equipment_id]);
  }

  async deleteByRecipeId(recipe_id: string) {
    const sql = `DELETE FROM recipe_equipment WHERE recipe_id = ?`;
    await this.pool.execute(sql, [recipe_id]);
  }

  /* not needed because of ON CASCADE DELETE ???
  async deleteByRecipeIds(ids: number[]) {
    const sql = `DELETE FROM recipe_equipment WHERE recipe_id = ANY(?)`;
    await this.pool.execute(sql, ids);
  }*/
}

export interface IRecipeEquipmentRepo {
  viewByRecipeId:      (recipe_id: string) =>    Promise<RecipeEquipmentView[]>;
  insert:              (params: InsertParams) => Promise<void>;
  update:              (params: UpdateParams) => Promise<void>;
  deleteByEquipmentId: (equipment_id: string) => Promise<void>;
  deleteByRecipeId:    (recipe_id: string) =>    Promise<void>;
  //deleteByRecipeIds:   (ids: string[]) =>        Promise<void>;
}

/*export type MakeRecipeEquipment = {
  amount:       number;
  equipment_id: string;
};*/

type RecipeEquipmentRow = {
  recipe_id:    string;
  amount:       number;
  equipment_id: string;
};

type InsertParams = {
  placeholders:     string;
  recipe_equipment: RecipeEquipmentRow[];
};

type UpdateParams = {
  recipe_id:        string;
  placeholders:     string;
  recipe_equipment: RecipeEquipmentRow[];
};

type RecipeEquipmentView = RowDataPacket & {
  amount:         number;
  equipment_name: string;
};

/*
async function bulkInsertMultipleRows(dataArray) {
  const sql = `
    INSERT INTO equipment
    (id, name)
    VALUES
    ${dataArr.map((_, index) => `(:id${index}, :name${index})`).join(', ')}
  `;
  await this.pool.execute.(sql, dataArr);
}
*/
