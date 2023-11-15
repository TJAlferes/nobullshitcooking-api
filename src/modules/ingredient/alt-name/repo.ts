import { ResultSetHeader } from 'mysql2';

import { MySQLRepo } from '../../shared/MySQL';

export class IngredientAltNameRepo extends MySQLRepo implements IngredientAltNameRepoInterface {
  async insert({ placeholders, alt_names }: InsertParams) {
    const sql = `
      INSERT INTO ingredient_alt_name (ingredient_id, alt_name)
      VALUES ${placeholders}
    `;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, alt_names);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }

  async update({ ingredient_id, placeholders, alt_names }: UpdateParams) {
    // Rather than updating current values in the database, we delete them,
    // and if there are new values, we insert them.
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();

    try {
      let sql = `DELETE FROM ingredient_alt_name WHERE ingredient_id = ?`;

      await conn.query(sql, [ingredient_id]);

      if (alt_names.length) {
        let sql = `
          INSERT INTO ingredient_alt_name (ingredient_id, alt_name)
          VALUES ${placeholders}
        `;

        await conn.query(sql, alt_names);
      }
    } catch (err) {

      await conn.rollback();
      throw err;

    } finally {

      conn.release();

    }
  }

  async deleteByIngredientId(ingredient_id: string) {
    const sql = `DELETE FROM ingredient_alt_name WHERE ingredient_id = ?`;
    const [ result ] = await this.pool.execute<ResultSetHeader>(sql, [ingredient_id]);
    if (result.affectedRows < 1) throw new Error('Query not successful.');
  }
}

export interface IngredientAltNameRepoInterface {
  insert:               (params: InsertParams) =>  Promise<void>;
  update:               (params: UpdateParams) =>  Promise<void>;
  deleteByIngredientId: (ingredient_id: string) => Promise<void>;
}

type IngredientAltNameRow = {
  ingredient_id: string;
  alt_name:      string;
}

type InsertParams = {
  placeholders: string;
  alt_names: IngredientAltNameRow[];
};

type UpdateParams = InsertParams & {
  ingredient_id: string;
};
