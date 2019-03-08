class Recipe {
  constructor(pool) {
    //super(props);
    this.pool = pool;  // .bind(this)?
  }
  
  viewAllRecipes() {
    const sql = `
      SELECT recipe_id, recipe_name, recipe_type_id, recipe_image
      FROM nobsc_recipes
    `;
    return pool.execute(sql);
  }

  viewRecipesOfType(typeId) {
    const sql = `
      SELECT recipe_id, recipe_name, recipe_type_id, recipe_image
      FROM nobsc_recipes
      WHERE recipe_type_id = ?
    `;
    return pool.execute(sql, [typeId]);
  }

  viewRecipeById(recipeId) {
    const sql = `
      SELECT recipe_id, recipe_name, recipe_type_id, recipe_image
      FROM nobsc_recipes
      WHERE recipe_id = ?
    `;
    return pool.execute(sql, [recipeId]);
  }

  createRecipe(recipeInfo) {
    const {
      id, name, typeId, image, equipmentImage, ingredientsImage, cookingImage
    } = recipeInfo;
    const sql = `
      INSERT INTO nobsc_recipes
      (recipe_id, recipe_name, recipe_type_id, recipe_image, equipment_image, ingredients_image, cooking_image)
      VALUES
      (?, ?, ?, ?, ?, ?, ?)
    `;
    return pool.execute(
      sql,
      [id, name, typeId, image, equipmentImage, ingredientsImage, cookingImage]
    );
  }
  
  updateRecipe(recipeInfo) {
    const {
      id, name, typeId, image, equipmentImage, ingredientsImage, cookingImage
    } = recipeInfo;
    const sql = `
      UPDATE nobsc_recipes
      SET recipe_name = ?, recipe_type_id = ?, recipe_image = ?, equipment_image = ?, ingredients_image = ?, cooking_image = ?
      WHERE recipe_id = ?`;
    return pool.execute(
      sql,
      [name, typeId, image, equipmentImage, ingredientsImage, cookingImage, id]
    );
  }
  
  deleteRecipe(recipeId) {
    const sql = `
      DELETE recipe_id, recipe_name
      FROM nobsc_recipes
      WHERE recipe_id = ?
      LIMIT 1
    `;
    return pool.execute(sql, [recipeId]);
  }
}

module.exports = Recipe;