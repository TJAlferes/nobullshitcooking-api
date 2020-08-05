import { Pool, RowDataPacket } from 'mysql2/promise';

export class Cuisine implements ICuisine {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.viewCuisines = this.viewCuisines.bind(this);
    this.viewCuisineById = this.viewCuisineById.bind(this);
    this.viewCuisineDetailById = this.viewCuisineDetailById.bind(this);
  }

  async viewCuisines() {
    const sql = `
      SELECT cuisine_id, cuisine_name, cuisine_nation
      FROM nobsc_cuisines
    `;
    const [ cuisines ] = await this.pool.execute<RowDataPacket[]>(sql);
    return cuisines;
  }

  async viewCuisineById(cuisineId: number) {
    const sql = `
      SELECT cuisine_id, cuisine_name, cuisine_nation
      FROM nobsc_cuisines
      WHERE cuisine_id = ?
    `;
    const [ cuisine ] = await this.pool
    .execute<RowDataPacket[]>(sql, [cuisineId]);
    return cuisine;
  }

  // TO DO: fix this...
  async viewCuisineDetailById(cuisineId: number) {
    const ownerId = 1;
    const sql = `
      SELECT
      c.cuisine_id,
      c.cuisine_name,
      c.cuisine_nation,
      c.cuisine_wiki,
      c.cuisine_intro,
      (
        SELECT s.supplier_id AS supplierId, s.supplier_name AS supplierName
        FROM nobsc_suppliers s
        INNER JOIN
          nobsc_cuisine_suppliers cs ON
          cs.supplier_id = s.supplier_id
        WHERE cs.cuisine_id = c.cuisine_id
      ) cuisine_suppliers,
      (
        SELECT e.equipment_id AS equipmentId, e.equipment_name AS equipmentName
        FROM nobsc_equipment e
        INNER JOIN
          nobsc_cuisine_equipment ce ON
          ce.equipment_id = e.equipment_id
        WHERE ce.cuisine_id = c.cuisine_id
      ) cuisine_equipment,
      (
        SELECT
          i.ingredient_id AS ingredientId,
          i.ingredient_name AS ingredientName
        FROM nobsc_ingredients i
        INNER JOIN
          nobsc_cuisine_ingredients ci ON
          ci.ingredient_id = i.ingredient_id
        WHERE ci.cuisine_id = c.cuisine_id
      ) cuisine_ingredients,
      (
        SELECT
          r.recipe_id AS recipeId,
          r.title AS title,
          r.recipe_image AS recipeImage
        FROM nobsc_recipes r
        WHERE r.owner_id = ? AND r.cuisine_id = c.cuisine_id
      ) official_recipes
      FROM nobsc_cuisines c
      WHERE c.cuisine_id = ?
    `;
    const [ cuisineDetail ] = await this.pool
    .execute<RowDataPacket[]>(sql, [ownerId, cuisineId]);
    return cuisineDetail;
  }
}

type Data = Promise<RowDataPacket[]>;

export interface ICuisine {
  pool: Pool;
  viewCuisines(): Data;
  viewCuisineById(cuisineId: number): Data;
  viewCuisineDetailById(cuisineId: number): Data;
}