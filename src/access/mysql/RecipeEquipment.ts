import { Pool, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export class RecipeEquipment implements IRecipeEquipment {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByRecipe = this.viewByRecipe.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.deleteByEquipment = this.deleteByEquipment.bind(this);
    this.deleteByRecipe = this.deleteByRecipe.bind(this);
    this.deleteByRecipes = this.deleteByRecipes.bind(this);
  }

  async viewByRecipe(recipe: string) {
    const sql = `
      SELECT re.amount, e.name AS equipment
      FROM recipe_equipment re
      INNER JOIN equipment e ON e.id = re.equipment
      WHERE re.recipe = ?
      ORDER BY e.type
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipe]);
    return rows;
  }

  async create(recipeEquipment: string[], placeholders: string) {
    const sql = `
      INSERT INTO recipe_equipment (recipe, equipment, amount)
      VALUES ${placeholders} 
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, recipeEquipment);
    return row;
  }

  // finish
  async update(
    recipeEquipment: string[],
    placeholders: string,
    recipe: string
  ) {
    const sql1 = `DELETE FROM recipe_equipment WHERE recipe = ?`;
    const sql2 = (recipeEquipment.length)
    ? `
      INSERT INTO recipe_equipment (recipe, equipment, amount)
      VALUES ${placeholders} 
    `
    : "none";
    const connection = await this.pool.getConnection();

    await connection.beginTransaction();

    try {
      await connection.query(sql1, [recipe]);

      if (sql2 !== "none") {
        const [ row ] = await connection.query(sql2, recipeEquipment);
        await connection.commit();
        return row;
      } else {
        await connection.commit();
      }
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async deleteByEquipment(equipment: string) {
    const sql = `DELETE FROM recipe_equipment WHERE equipment = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [equipment]);
    return rows;
  }

  async deleteByRecipe(recipe: string) {
    const sql = `DELETE FROM recipe_equipment WHERE recipe = ?`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [recipe]);
    return rows;
  }

  async deleteByRecipes(recipes: string[]) {
    const sql = `DELETE FROM recipe_equipment WHERE recipe = ANY(?)`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, recipes);
    return rows;
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithExtra = Promise<
  RowDataPacket[] |
  RowDataPacket[][] |
  OkPacket |
  OkPacket[] |
  ResultSetHeader |
  undefined
>;

export interface IRecipeEquipment {
  pool: Pool;
  viewByRecipe(recipe: string): Data;
  create(recipeEquipment: (string|number)[], placeholders: string): Data;
  update(
    recipeEquipment: (string|number)[],
    placeholders: string,
    recipe: string
  ): DataWithExtra;  // | finish
  deleteByEquipment(equipment: string): Data;
  deleteByRecipe(recipe: string): Data;
  deleteByRecipes(recipes: string[]): Data;
}

export interface IMakeRecipeEquipment {
  equipment: string;
  amount: string;
}