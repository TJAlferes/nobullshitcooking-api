import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { MySQLRepo } from '../../shared/MySQL';

export class RecipeEquipmentRepo extends MySQLRepo implements RecipeEquipmentRepoInterface {
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

  async bulkInsert({ placeholders, recipe_equipment }: BulkInsertParams) {  // TO DO: change to namedPlaceholders using example below
    const sql = `
      INSERT INTO recipe_equipment (recipe_id, amount, equipment_id)
      VALUES ${placeholders}
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, recipe_equipment);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async bulkUpdate({ recipe_id, placeholders, recipe_equipment }: BulkUpdateParams) {  // TO DO: change to namedPlaceholders using example below
    // Rather than updating current values in the database, we delete them,
    // and if there are new values, we insert them.
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();
    try {
      let sql = `DELETE FROM recipe_equipment WHERE recipe_id = ?`;
      await conn.query(sql, [recipe_id]);
      if (recipe_equipment.length > 0) {
        let sql = `
          INSERT INTO recipe_equipment (recipe_id, amount, equipment_id)
          VALUES ${placeholders}
        `;
        await conn.query(sql, recipe_equipment);
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
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [equipment_id]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async deleteByRecipeId(recipe_id: string) {
    const sql = `DELETE FROM recipe_equipment WHERE recipe_id = ?`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [recipe_id]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
}

export interface RecipeEquipmentRepoInterface {
  viewByRecipeId:      (recipe_id: string) =>        Promise<RecipeEquipmentView[]>;
  bulkInsert:          (params: BulkInsertParams) => Promise<void>;
  bulkUpdate:          (params: BulkUpdateParams) => Promise<void>;
  deleteByEquipmentId: (equipment_id: string) =>     Promise<void>;
  deleteByRecipeId:    (recipe_id: string) =>        Promise<void>;
}

type RecipeEquipmentRow = {
  recipe_id:    string;
  amount:       number | null;
  equipment_id: string;
};

type BulkInsertParams = {
  placeholders:     string;
  recipe_equipment: RecipeEquipmentRow[];
};

type BulkUpdateParams = {
  recipe_id:        string;
  placeholders:     string;
  recipe_equipment: RecipeEquipmentRow[];
};

type RecipeEquipmentView = RowDataPacket & {
  amount:         number | null;
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
