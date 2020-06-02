import { Pool, RowDataPacket } from 'mysql2/promise';

export class RecipeType {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewAllRecipeTypes = this.viewAllRecipeTypes.bind(this);
    this.viewRecipeTypeById = this.viewRecipeTypeById.bind(this);
  }

  async viewAllRecipeTypes() {
    const sql = `
      SELECT recipe_type_id, recipe_type_name
      FROM nobsc_recipe_types
    `;
    const [ allRecipeTypes ] = await this.pool.execute(sql);
    return allRecipeTypes;
  }

  async viewRecipeTypeById(typeId: number) {
    const sql = `
      SELECT recipe_type_id, recipe_type_name
      FROM nobsc_recipe_types
      WHERE recipe_type_id = ?
    `;
    const [ recipeType ] = await this.pool.execute(sql, [typeId]);
    return recipeType;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IRecipeType {
  pool: Pool;
}