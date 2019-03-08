class Ingredient {
  constructor(pool) {
    this.pool = pool;
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

  }

  viewIngredientsOfType(starting, display, typeId) {

  }

  viewIngredientsOfTypes(starting, display, placeholders, typeIds) {  // typeIds must be an array

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

  }

  updateIngredient(ingredientInfo) {

  }

  deleteIngredient(ingredientId) {

  }
}

module.exports = Ingredient;