import { Pool, RowDataPacket } from 'mysql2/promise';

export class CuisineIngredient implements ICuisineIngredient {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByCuisineId = this.viewByCuisineId.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  async viewByCuisineId(cuisineId: number) {
    const sql = `
      SELECT i.id AS ingredient_id, i.name AS ingredient_name
      FROM cuisine_ingredients ci
      INNER JOIN ingredients i ON i.id = ci.ingredient_id
      WHERE ci.cuisine_id = ?
      GROUP BY i.ingredient_type_id
      ORDER BY i.name ASC
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [cuisineId]);
    return rows;
  }

  async create(cuisineId: number, ingredientId: number) {
    const sql = `
      INSERT INTO cuisine_ingredients (cuisine_id, ingredient_id) VALUES (?, ?)
    `;
    const [ row ] = await this.pool
    .execute<RowDataPacket[]>(sql, [cuisineId, ingredientId]);
    return row;
  }

  async delete(cuisineId: number, ingredientId: number) {
    const sql = `
      DELETE FROM cuisine_ingredients WHERE cuisineId = ? AND ingredient_id = ?
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [cuisineId, ingredientId]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ICuisineIngredient {
  pool: Pool;
  viewByCuisineId(cuisineId: number): Data;
  create(cuisineId: number, ingredientId: number): Data;
  delete(cuisineId: number, ingredientId: number): Data;
}