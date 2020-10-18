import { Pool, RowDataPacket } from 'mysql2/promise';

export class CuisineIngredient implements ICuisineIngredient {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByCuisine = this.viewByCuisine.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  // double check
  async viewByCuisine(cuisine: string) {
    const sql = `
      SELECT ci.ingredient
      FROM cuisine_ingredients ci
      INNER JOIN ingredients i ON i.id = ci.ingredient
      WHERE ci.cuisine = ?
      GROUP BY i.ingredient_type
      ORDER BY i.name ASC
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [cuisine]);
    return rows;
  }

  async create(cuisine: string, ingredient: string) {
    const sql = `
      INSERT INTO cuisine_ingredients (cuisine, ingredient) VALUES (?, ?)
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [cuisine, ingredient]);
    return row;
  }

  async delete(cuisine: string, ingredient: string) {
    const sql = `
      DELETE FROM cuisine_ingredients WHERE cuisine = ? AND ingredient = ?
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [cuisine, ingredient]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ICuisineIngredient {
  pool: Pool;
  viewByCuisine(cuisine: string): Data;
  create(cuisine: string, ingredient: string): Data;
  delete(cuisine: string, ingredient: string): Data;
}