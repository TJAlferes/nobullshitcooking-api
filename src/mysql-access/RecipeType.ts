import { Pool, RowDataPacket } from 'mysql2/promise';

export class RecipeType implements IRecipeType {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewRecipeTypes = this.viewRecipeTypes.bind(this);
    this.viewRecipeTypeById = this.viewRecipeTypeById.bind(this);
  }

  async viewRecipeTypes() {
    const sql = `
      SELECT recipe_type_id, recipe_type_name
      FROM nobsc_recipe_types
    `;
    const [ allRecipeTypes ] = await this.pool.execute<RowDataPacket[]>(sql);
    return allRecipeTypes;
  }

  async viewRecipeTypeById(recipeTypeId: number) {
    const sql = `
      SELECT recipe_type_id, recipe_type_name
      FROM nobsc_recipe_types
      WHERE recipe_type_id = ?
    `;
    const [ recipeType ] = await this.pool
    .execute<RowDataPacket[]>(sql, [recipeTypeId]);
    return recipeType;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IRecipeType {
  pool: Pool;
  viewRecipeTypes(): Data;
  viewRecipeTypeById(recipeTypeId: number): Data;
}