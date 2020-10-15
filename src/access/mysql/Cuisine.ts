import { Pool, RowDataPacket } from 'mysql2/promise';

export class Cuisine implements ICuisine {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.view = this.view.bind(this);
    this.viewById = this.viewById.bind(this);
    this.viewDetailById = this.viewDetailById.bind(this);
  }

  async view() {
    const sql = `SELECT id, name, nation FROM cuisines`;
    const [ rows ] = await this.pool.execute<RowDataPacket[]>(sql);
    return rows;
  }

  async viewById(id: number) {
    const sql = `SELECT id, name, nation FROM cuisines WHERE id = ?`;
    const [ row ] = await this.pool.execute<RowDataPacket[]>(sql, [id]);
    return row;
  }

  // TO DO: fix this... see Recipe for JSON functions
  async viewDetailById(id: number) {
    const ownerId = 1;
    const sql = `
      SELECT
      c.id,
      c.name,
      c.nation,
      c.wiki,
      c.intro,
      (
        SELECT s.id AS supplier_id, s.name AS supplier_name
        FROM suppliers s
        INNER JOIN cuisine_suppliers cs ON cs.supplier_id = s.id
        WHERE cs.cuisine_id = c.id
      ) cuisine_suppliers,
      (
        SELECT e.id AS equipment_id, e.name AS equipment_name
        FROM equipment e
        INNER JOIN cuisine_equipment ce ON ce.equipment_id = e.id
        WHERE ce.cuisine_id = c.id
      ) cuisine_equipment,
      (
        SELECT i.id AS ingredient_id, i.name AS ingredient_name
        FROM ingredients i
        INNER JOIN cuisine_ingredients ci ON ci.ingredient_id = i.id
        WHERE ci.cuisine_id = c.id
      ) cuisine_ingredients,
      (
        SELECT r.id AS recipe_id, r.title, r.recipe_image
        FROM recipes r
        WHERE r.owner_id = ? AND r.cuisine_id = c.id
      ) official_recipes
      FROM cuisines c
      WHERE c.id = ?
    `;
    const [ row ] = await this.pool
      .execute<RowDataPacket[]>(sql, [ownerId, id]);
    return row;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ICuisine {
  pool: Pool;
  view(): Data;
  viewById(id: number): Data;
  viewDetailById(id: number): Data;
}