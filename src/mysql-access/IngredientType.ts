import { Pool } from 'mysql2/promise';

export class IngredientType {
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
    const [ allIngredientTypes ] = await this.pool.execute(sql);
    return allIngredientTypes;
  }

  async viewIngredientTypeById(typeId) {
    const sql = `
      SELECT ingredient_type_id, ingredient_type_name
      FROM nobsc_ingredient_types
      WHERE ingredient_type_id = ?
    `;
    const [ ingredientType ] = await this.pool.execute(sql, [typeId]);
    console.log(ingredientType);
    return ingredientType;
  }
}