class Ingredient {
  constructor(pool) {
    this.pool = pool;
    this.countAllIngredients = this.countAllIngredients.bind(this);
    this.countIngredientsOfType = this.countIngredientsOfType.bind(this);
    this.countIngredientsOfTypes = this.countIngredientsOfTypes.bind(this);
    this.viewAllIngredients = this.viewAllIngredients.bind(this);
    this.viewIngredientsOfType = this.viewIngredientsOfType.bind(this);
    this.viewIngredientsOfTypes = this.viewIngredientsOfTypes.bind(this);
    this.viewIngredientById = this.viewIngredientById.bind(this);
    this.createIngredient = this.createIngredient.bind(this);
    this.updateIngredient = this.updateIngredient.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
  }

  countAllIngredients() {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_ingredients
    `;
    return pool.execute(sql);
  }

  countIngredientsOfType(typeId) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_ingredients
      WHERE ingredient_type_id = ?
    `;
    return pool.execute(sql, [typeId]);
  }

  countIngredientsOfTypes(placeholders, typeIds) {  // typeIds must be an array
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_ingredients
      WHERE ingredient_type_id IN (${placeholders})
    `;
    return pool.execute(sql, typeIds);
  }

  viewAllIngredients(starting, display) {
    const sql = `
      SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
      FROM nobsc_ingredients
      ORDER BY ingredient_name ASC
      LIMIT ${starting}, ${display}
    `;
    return pool.execute(sql);
  }

  viewIngredientsOfType(starting, display, typeId) {
    const sql = `
      SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
      FROM nobsc_ingredients
      WHERE ingredient_type_id = ?
      ORDER BY ingredient_name ASC
      LIMIT ${starting}, ${display}
    `;
    return pool.execute(sql, [typeId]);
  }

  viewIngredientsOfTypes(starting, display, placeholders, typeIds) {  // typeIds must be an array
    const sql = `
      SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
      FROM nobsc_ingredients
      WHERE ingredient_type_id IN (${placeholders})
      ORDER BY ingredient_name ASC
      LIMIT ${starting}, ${display}
    `;
    return pool.execute(sql, typeIds);
  }

  viewIngredientById(ingredientId) {
    const sql = `
      SELECT
        i.ingredient_id AS ingredient_id,
        i.ingredient_name AS ingredient_name,
        i.ingredient_type_id AS ingredient_type,
        i.ingredient_image AS ingredient_image,
        t.ingredient_type_name AS ingredient_type_name
      FROM nobsc_ingredient_types t
      LEFT JOIN nobsc_ingredients i ON i.ingredient_type_id = t.ingredient_type_id
      WHERE ingredient_id = ?
    `;
    return pool.execute(sql, [ingredientId]);
  }

  createIngredient(ingredientInfo) {
    const { id, name, typeId, image } = ingredientInfo;
    const sql = `
      INSERT INTO nobsc_ingredients
      (ingredient_id, ingredient_name, ingredient_type_id, ingredient_image)
      VALUES
      (?, ?, ?, ?)
    `;
    return pool.execute(sql, [id, name, typeId, image]);
  }

  updateIngredient(ingredientInfo) {
    const { id, name, typeId, image } = ingredientInfo;
    const sql = `
      UPDATE nobsc_ingredients
      SET ingredient_name = ?, ingredient_type_id = ?, ingredient_image = ?
      WHERE ingredient_id = ?
      LIMIT 1
    `;
    return pool.execute(sql, [name, typeId, image, id]);
  }

  deleteIngredient(ingredientId) {
    const sql = `
      DELETE
      FROM nobsc_ingredient
      WHERE ingredient_id = ?
      LIMIT 1
    `;
    return pool.execute(sql, [ingredientId]);
  }
}

module.exports = Ingredient;