class Recipe {
  constructor(pool) {
    this.pool = pool;
    this.countAllRecipes = this.countAllRecipes.bind(this);
    this.countRecipesOfType = this.countRecipesOfType.bind(this);
    this.countRecipesOfTypes = this.countRecipesOfTypes.bind(this);
    this.viewAllRecipes = this.viewAllRecipes.bind(this);
    this.viewRecipesOfType = this.viewRecipesOfType.bind(this);
    this.viewRecipesOfTypes = this.viewRecipesOfTypes.bind(this);
    this.viewRecipeById = this.viewRecipeById.bind(this);
    this.createRecipe = this.createRecipe.bind(this);
    this.updateRecipe = this.updateRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }
  
  // to do: cusines

  countAllRecipes() {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
    `;
    return pool.execute(sql);
  }

  countRecipesOfType(typeId) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE recipe_type_id = ?
    `;
    return pool.execute(sql, [typeId]);
  }

  countRecipesOfTypes(placeholders, typeIds) {  // typeIds must be an array
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE recipe_type_id IN (${placeholders})
    `;
    return pool.execute(sql, typeIds);
  }

  viewAllRecipes(starting, display) {
    const sql = `
      SELECT recipe_id, recipe_name, recipe_type_id, recipe_image
      FROM nobsc_recipes
      ORDER BY recipe_name ASC
      LIMIT ${starting}, ${display}
    `;
    return pool.execute(sql);
  }

  viewRecipesOfType(starting, display, typeId) {
    const sql = `
      SELECT recipe_id, recipe_name, recipe_type_id, recipe_image
      FROM nobsc_recipes
      WHERE recipe_type_id = ?
      ORDER BY recipe_name ASC
      LIMIT ${starting}, ${display}
    `;
    return pool.execute(sql, [typeId]);
  }

  viewRecipesOfTypes(starting, display, placeholders, typeIds) {  // typeIds must be an array
    const sql = `
      SELECT recipe_id, recipe_name, recipe_type_id, recipe_image
      FROM nobsc_recipes
      WHERE recipe_type_id IN (${placeholders})
      ORDER BY recipe_name ASC
      LIMIT ${starting}, ${display}
    `;
    return pool.execute(sql, typeIds);
  }

  viewRecipeById(recipeId) {
    const sql = `
      SELECT
        r.recipe_id AS recipe_id,
        r.recipe_name AS recipe_name,
        r.recipe_type_id AS recipe_type_id,
        r.recipe_image AS recipe_image,
        t.recipe_type_name AS recipe_type_name
      FROM nobsc_recipe_types t
      LEFT JOIN nobsc_recipes r ON r.recipe_type_id = t.recipe_type_id
      WHERE recipe_id = ?
    `;  // ... Is this right?
    return pool.execute(sql, [recipeId]);
  }

  createRecipe(recipeInfo) {
    const { id, name, typeId, image, equipmentImage, ingredientsImage, cookingImage } = recipeInfo;
    const sql = `
      INSERT INTO nobsc_recipes
      (recipe_id, recipe_name, recipe_type_id, recipe_image, equipment_image, ingredients_image, cooking_image)
      VALUES
      (?, ?, ?, ?, ?, ?, ?)
    `;
    return pool.execute(sql, [id, name, typeId, image, equipmentImage, ingredientsImage, cookingImage]);
  }
  
  updateRecipe(recipeInfo) {
    const { id, name, typeId, image, equipmentImage, ingredientsImage, cookingImage } = recipeInfo;
    const sql = `
      UPDATE nobsc_recipes
      SET recipe_name = ?, recipe_type_id = ?, recipe_image = ?, equipment_image = ?, ingredients_image = ?, cooking_image = ?
      WHERE recipe_id = ?
      LIMIT 1
    `;
    return pool.execute(sql, [name, typeId, image, equipmentImage, ingredientsImage, cookingImage, id]);
  }
  
  deleteRecipe(recipeId) {
    const sql = `
      DELETE
      FROM nobsc_recipes
      WHERE recipe_id = ?
      LIMIT 1
    `;
    return pool.execute(sql, [recipeId]);
  }
}

module.exports = Recipe;