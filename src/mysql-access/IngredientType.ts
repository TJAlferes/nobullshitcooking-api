import { Pool, RowDataPacket } from 'mysql2/promise';

export class IngredientType implements IIngredientType {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewAllIngredientTypes = this.viewAllIngredientTypes.bind(this);
    this.viewIngredientTypeById = this.viewIngredientTypeById.bind(this);
  }

  async viewAllIngredientTypes() {
    const sql = `
      SELECT ingredient_type_id, ingredient_type_name
      FROM nobsc_ingredient_types
    `;
    const [ allIngredientTypes ] = await this.pool
    .execute<RowDataPacket[]>(sql);
    return allIngredientTypes;
  }

  async viewIngredientTypeById(ingredientTypeId: number) {
    const sql = `
      SELECT ingredient_type_id, ingredient_type_name
      FROM nobsc_ingredient_types
      WHERE ingredient_type_id = ?
    `;
    const [ ingredientType ] = await this.pool
    .execute<RowDataPacket[]>(sql, [ingredientTypeId]);
    return ingredientType;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IIngredientType {
  pool: Pool;
  viewAllIngredientTypes(): Data;
  viewIngredientTypeById(ingredientTypeId: number): Data;
}