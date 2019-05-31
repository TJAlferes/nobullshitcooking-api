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
  // to do: steps

  async countAllRecipes() {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
    `;
    const [ allRecipesCount ] = await this.pool.execute(sql);
    return allRecipesCount;
  }

  async countRecipesOfType(typeId) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE recipe_type_id = ?
    `;
    const [ allRecipesOfTypeCount ] = await this.pool.execute(sql, [typeId]);
    return allRecipesOfTypeCount;
  }

  async countRecipesOfTypes(placeholders, typeIds) {  // typeIds must be an array
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE recipe_type_id IN (${placeholders})
    `;
    const [ allRecipesOfTypesCount ] = await this.pool.execute(sql, typeIds);
    return allRecipesOfTypesCount;
  }

  async viewAllRecipes(starting, display) {
    const sql = `
      SELECT recipe_id, recipe_name, recipe_type_id, recipe_image
      FROM nobsc_recipes
      ORDER BY recipe_name ASC
      LIMIT ?, ?
    `;
    const [ allRecipes ] = await this.pool.execute(sql, [starting, display]);
    return allRecipes;
  }

  async viewRecipesOfType(starting, display, typeId) {
    const sql = `
      SELECT recipe_id, recipe_name, recipe_type_id, recipe_image
      FROM nobsc_recipes
      WHERE recipe_type_id = ?
      ORDER BY recipe_name ASC
      LIMIT ${starting}, ${display}
    `;  // TO DO: change to ? for security
    const [ allRecipesOfType ] = await this.pool.execute(sql, [typeId]);
    return allRecipesOfType;
  }

  async viewRecipesOfTypes(starting, display, placeholders, typeIds) {  // typeIds must be an array
    const sql = `
      SELECT recipe_id, recipe_name, recipe_type_id, recipe_image
      FROM nobsc_recipes
      WHERE recipe_type_id IN (${placeholders})
      ORDER BY recipe_name ASC
      LIMIT ${starting}, ${display}
    `;  // TO DO: change to ? for security
    const [ allRecipesOfTypes ] = await this.pool.execute(sql, typeIds);
    return allRecipesOfTypes;
  }

  async viewRecipeById(recipeId) {
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
    `;  // ... Is this right? you need cuisine and steps
    const [ recipe ] = await this.pool.execute(sql, [recipeId]);
    return recipe;
  }

  async createRecipe(recipeInfo) {
    const { id, name, typeId, image, equipmentImage, ingredientsImage, cookingImage } = recipeInfo;
    const sql = `
      INSERT INTO nobsc_recipes
      (recipe_id, recipe_name, recipe_type_id, required_equipment, required_ingredients, required_subrecipes, recipe_image, equipment_image, ingredients_image, cooking_image)
      VALUES
      (?, ?, ?, ?, ?, ?, ?)
    `;
    const [ createdRecipe ] = await this.pool.execute(sql, [id, name, typeId, image, equipmentImage, ingredientsImage, cookingImage]);
    return createdRecipe;
  }
  
  async updateRecipe(recipeInfo) {
    const { id, name, typeId, image, equipmentImage, ingredientsImage, cookingImage } = recipeInfo;
    const sql = `
      UPDATE nobsc_recipes
      SET recipe_name = ?, recipe_type_id = ?, recipe_image = ?, equipment_image = ?, ingredients_image = ?, cooking_image = ?
      WHERE recipe_id = ?
      LIMIT 1
    `;
    const [ updatedRecipe ] = await this.pool.execute(sql, [name, typeId, image, equipmentImage, ingredientsImage, cookingImage, id]);
    return updatedRecipe;
  }
  
  async deleteRecipe(recipeId) {
    const sql = `
      DELETE
      FROM nobsc_recipes
      WHERE recipe_id = ?
      LIMIT 1
    `;
    const [ deletedRecipe ] = await this.pool.execute(sql, [recipeId]);
    return deletedRecipe;
  }
}

module.exports = Recipe;