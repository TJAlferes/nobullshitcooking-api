import { Pool, RowDataPacket } from 'mysql2/promise';

export class IngredientType implements IIngredientType {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewIngredientTypes = this.viewIngredientTypes.bind(this);
    this.viewIngredientTypeById = this.viewIngredientTypeById.bind(this);
  }

  async viewIngredientTypes() {
    const sql = `
      SELECT ingredient_type_id, ingredient_type_name
      FROM nobsc_ingredient_types
    `;
    const [ ingredientTypes ] = await this.pool
    .execute<RowDataPacket[]>(sql);
    return ingredientTypes;
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
  viewIngredientTypes(): Data;
  viewIngredientTypeById(ingredientTypeId: number): Data;
}