import { Pool, RowDataPacket } from 'mysql2/promise';

export class Cuisine implements ICuisine {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewByName = this.viewByName.bind(this);
    this.viewDetailByName = this.viewDetailByName.bind(this);
  }

  async view() {
    const sql = `SELECT name, nation FROM cuisines`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    return rows;
  }

  async viewByName(name: string) {
    const sql = `SELECT name, nation FROM cuisines WHERE name = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [name]);
    return row;
  }

  async viewDetailByName(name: string) {
    const owner = "NOBSC";
    const sql = `
      SELECT
      c.name,
      c.nation,
      c.wiki,
      c.intro,
      (
        SELECT r.id, r.title, r.recipe_image
        FROM recipes r
        WHERE r.owner = ? AND r.cuisine = c.name
      ) official_recipes
      FROM cuisines c
      WHERE c.name = ?
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [owner, name]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ICuisine {
  pool: Pool;
  view(): Data;
  viewByName(name: string): Data;
  viewDetailByName(name: string): Data;
}