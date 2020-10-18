import { Pool, RowDataPacket } from 'mysql2/promise';

export class SavedRecipe implements ISavedRecipe {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByUser = this.viewByUser.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  async viewByUser(user: string) {
    const sql = `
      SELECT 
        s.recipe,
        r.title,
        r.recipe_image,
        r.owner,
        r.type,
        r.cuisine
      FROM saved_recipes s
      INNER JOIN recipes r ON r.id = s.recipe
      WHERE user = ?
      ORDER BY title
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [user]);
    return rows;
  }

  async create(user: string, recipe: string) {
    await this.delete(user, recipe);
    const sql = `INSERT INTO saved_recipes (user, recipe) VALUES (?, ?)`;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [user, recipe]);
    return row;
  }

  async delete(user: string, recipe: string) {
    const sql = `
      DELETE FROM saved_recipes WHERE user = ? AND recipe = ? LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [user, recipe]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ISavedRecipe {
  pool: Pool;
  viewByUser(user: string): Data;
  create(user: string, recipe: string): Data;
  delete(user: string, recipe: string): Data;
}