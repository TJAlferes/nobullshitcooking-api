import { Pool, RowDataPacket } from 'mysql2/promise';

export class FavoriteRecipe implements IFavoriteRecipe {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewByUser = this.viewByUser.bind(this);
    //this.viewMost = this.viewMost.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  async viewByUser(user: string) {
    const sql = `
      SELECT 
        f.recipe,
        r.title,
        r.recipe_image,
        r.owner,
        r.type,
        r.cuisine
      FROM favorite_recipes f
      INNER JOIN recipes r ON r.id = f.recipe
      WHERE f.user = ?
      ORDER BY r.title
    `;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql, [user]);
    return rows;
  }

  /*async viewMost(limit: number) {
    //const sql = `
    //  SELECT recipe_id
    //  FROM favorite_recipes
    //  ORDER BY COUNT(user_id) DESC
    //  LIMIT ?
    //`;
    const sql = `
      SELECT recipe_id, COUNT(recipe_id) AS tally
      FROM favorite_recipes
      GROUP BY recipe_id
      ORDER BY tally DESC
      LIMIT ?
    `;
    const [ rows ] = this.pool.execute(sql, [limit]);
    return rows;
  }*/

  async create(user: string, recipe: string) {
    await this.delete(user, recipe);
    const sql = `INSERT INTO favorite_recipes (user, recipe) VALUES (?, ?)`;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [user, recipe]);
    return row;
  }

  async delete(user: string, recipe: string) {
    const sql = `
      DELETE FROM favorite_recipes WHERE user = ? AND recipe = ? LIMIT 1
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [user, recipe]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface IFavoriteRecipe {
  pool: Pool;
  //viewMost(): Data;
  viewByUser(user: string): Data;
  create(user: string, recipe: string): Data;
  delete(user: string, recipe: string): Data;
}