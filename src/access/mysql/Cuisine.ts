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

  // TO DO: fix this... see Recipe for JSON functions
  async viewDetailByName(name: string) {
    const owner = "NOBSC";
    const sql = `
      SELECT
      c.name,
      c.nation,
      c.wiki,
      c.intro,
      (
        SELECT s.name AS supplier_name
        FROM suppliers s
        INNER JOIN cuisine_suppliers cs ON cs.supplier = s.name
        WHERE cs.cuisine = c.name
      ) cuisine_suppliers,
      (
        SELECT e.id AS equipment_id, e.name AS equipment_name
        FROM equipment e
        INNER JOIN cuisine_equipment ce ON ce.equipment_id = e.id
        WHERE ce.cuisine = c.name
      ) cuisine_equipment,
      (
        SELECT i.id AS ingredient_id, i.name AS ingredient_name
        FROM ingredients i
        INNER JOIN cuisine_ingredients ci ON ci.ingredient_id = i.id
        WHERE ci.cuisine = c.name
      ) cuisine_ingredients,
      (
        SELECT r.id AS recipe_id, r.title, r.recipe_image
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