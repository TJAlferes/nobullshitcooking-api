class Cuisine {
  constructor(pool) {
    this.pool = pool;
    this.viewAllCuisines = this.viewAllCuisines.bind(this);
    this.viewCuisineById = this.viewCuisineById.bind(this);
    this.viewCuisineDetailById = this.viewCuisineDetailById.bind(this);
  }

  async viewAllCuisines() {
    const sql = `
      SELECT cuisine_id, cuisine_name, cuisine_nation
      FROM nobsc_cuisines
    `;
    const [ allCuisines ] = await this.pool.execute(sql);
    return allCuisines;
  }

  async viewCuisineById(cuisineId) {
    const sql = `
      SELECT cuisine_id, cuisine_name, cuisine_nation
      FROM nobsc_cuisines
      WHERE cuisine_id = ?
    `;
    const [ cuisine ] = await this.pool.execute(sql, [cuisineId]);
    return cuisine;
  }

  async viewCuisineDetailById(cuisineId) {
    const ownerId = 1;
    const sql1 = `
      SELECT
        c.cuisine_id,
        c.cuisine_name,
        c.cuisine_nation,
        c.cuisine_wiki,
        c.cuisine_intro
      FROM nobsc_cuisines
      WHERE cuisine_id = ?
    `;
    const sql2 = `
      SELECT s.supplier_id AS supplierId, s.supplier_name AS supplierName
      FROM nobsc_suppliers s
      INNER JOIN nobsc_cuisine_suppliers cs ON cs.supplier_id = s.supplier_id
      WHERE cs.cuisine_id = ?
    `;
    const sql3 = `
      SELECT e.equipment_id AS equipmentId, e.equipment_name AS equipmentName
      FROM nobsc_equipment e
      INNER JOIN nobsc_cuisine_equipment ce ON ce.equipment_id = e.equipment_id
      WHERE ce.cuisine_id = ?
    `;
    const sql4 = `
      SELECT i.ingredient_id AS ingredientId, i.ingredient_name AS ingredientName
      FROM nobsc_ingredients i
      INNER JOIN nobsc_cuisine_ingredients ci ON ci.ingredient_id = i.ingredient_id
      WHERE ci.cuisine_id = ?
    `;
    const sql5 = `
      SELECT
        r.recipe_id AS recipeId,
        r.title AS title,
        r.recipe_image AS recipeImage
      FROM nobsc_recipes r
      WHERE r.owner_id = ? AND r.cuisine_id = ?
    `;

    const [ cuisine ] = await this.pool.execute(sql1, [cuisineId]);
    const [ cuisineSuppliers ] = await this.pool.execute(sql2, [cuisineId]);
    const [ cuisineEquipment ] = await this.pool.execute(sql3, [cuisineId]);
    const [ cuisineIngredients ] = await this.pool.execute(sql4, [cuisineId]);
    const [ officialRecipes ] = await this.pool.execute(sql5, [ownerId, cuisineId]);
    
    const detail = {
      cuisine,
      cuisineSuppliers,
      cuisineEquipment,
      cuisineIngredients,
      officialRecipes
    };
    
    return detail;
  }
}

module.exports = Cuisine;