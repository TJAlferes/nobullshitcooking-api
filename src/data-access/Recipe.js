class Recipe {
  constructor(pool) {
    this.pool = pool;

    this.countAllRecipes = this.countAllRecipes.bind(this);
    this.countRecipesOfType = this.countRecipesOfType.bind(this);
    this.countRecipesOfTypes = this.countRecipesOfTypes.bind(this);
    this.countRecipesOfCuisine = this.countRecipesOfCuisine.bind(this);
    this.countRecipesOfCuisines = this.countRecipesOfCuisines.bind(this);
    this.countRecipesOfCuisinesAndTypes = this.countRecipesOfCuisinesAndTypes.bind(this);
    this.countRecipesOfCuisinesAndType = this.countRecipesOfCuisinesAndType.bind(this);
    this.countRecipesOfCuisineAndTypes = this.countRecipesOfCuisineAndTypes.bind(this);
    this.countRecipesOfCuisineAndType = this.countRecipesOfCuisineAndType.bind(this);

    this.viewAllRecipes = this.viewAllRecipes.bind(this);
    this.viewRecipesOfType = this.viewRecipesOfType.bind(this);
    this.viewRecipesOfTypes = this.viewRecipesOfTypes.bind(this);
    this.viewRecipesOfCuisine = this.viewRecipesOfCuisine.bind(this);
    this.viewRecipesOfCuisines = this.viewRecipesOfCuisines.bind(this);
    this.viewRecipesOfCuisinesAndTypes = this.viewRecipesOfCuisinesAndTypes.bind(this);
    this.viewRecipesOfCuisinesAndType = this.viewRecipesOfCuisinesAndType.bind(this);
    this.viewRecipesOfCuisineAndTypes = this.viewRecipesOfCuisineAndTypes.bind(this);
    this.viewRecipesOfCuisineAndType = this.viewRecipesOfCuisineAndType.bind(this);
    this.viewRecipeById = this.viewRecipeById.bind(this);
    this.viewRecipeTitlesByIds = this.viewRecipeTitlesByIds.bind(this);
    this.viewRecipesForSubmitEditForm = viewRecipesForSubmitEditForm.bind(this);

    this.createRecipe = this.createRecipe.bind(this);
    this.updateRecipe = this.updateRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }
  
  /*
  counting methods
  */

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

  async countRecipesOfTypes(placeholders, typeIds) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE recipe_type_id IN (${placeholders})
    `;
    const [ allRecipesOfTypesCount ] = await this.pool.execute(sql, typeIds);
    return allRecipesOfTypesCount;
  }

  async countRecipesOfCuisine(cuisineId) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE cuisine_id = ?
    `;
    const [ allRecipesOfCuisineCount ] = await this.pool.execute(sql, [cuisineId]);
    return allRecipesOfCuisineCount;
  }

  async countRecipesOfCuisines(placeholders, cuisineIds) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE cuisine_id IN (${placeholders})
    `;
    const [ allRecipesOfCuisinesCount ] = await this.pool.execute(sql, cuisineIds);
    return allRecipesOfCuisinesCount;
  }

  async countRecipesOfCuisinesAndTypes(cuisinePlaceholders, typePlaceholders, ids) {
    const sql=`
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE cuisine_id IN (${cuisinePlaceholders}) AND recipe_type_id IN (${typePlaceholders})
    `;
    const [ allRecipesOfCuisinesAndTypesCount ] = await this.pool.execute(sql, ids);
    return allRecipesOfCuisinesAndTypesCount;
  }

  async countRecipesOfCuisinesAndType(cuisinePlaceholders, ids) {
    const sql=`
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE cuisine_id IN (${cuisinePlaceholders})
    `;
    const [ allRecipesOfCuisinesAndTypeCount ] = await this.pool.execute(sql, ids);
    return allRecipesOfCuisinesAndTypeCount;
  }

  async countRecipesOfCuisineAndTypes(typePlaceholders, ids) {
    const sql=`
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE cuisine_id = ? AND recipe_type_id IN (${typePlaceholders})
    `;
    const [ allRecipesOfCuisineAndTypesCount ] = await this.pool.execute(sql, ids);
    return allRecipesOfCuisineAndTypesCount;
  }

  async countRecipesOfCuisineAndType(ids) {
    const sql=`
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE cuisine_id = ? AND recipe_type_id = ?
    `;
    const [ allRecipesOfCuisineAndTypeCount ] = await this.pool.execute(sql, ids);
    return allRecipesOfCuisineAndTypeCount;
  }

  /*
  viewing methods
  */

  async viewAllRecipes(starting, display) {
    const sql = `
      SELECT recipe_id, title, recipe_image
      FROM nobsc_recipes
      ORDER BY title ASC
      LIMIT ?, ?
    `;
    const [ allRecipes ] = await this.pool.execute(sql, [starting, display]);
    return allRecipes;
  }

  async viewRecipesOfType(starting, display, typeId) {
    const sql = `
      SELECT recipe_id, title, recipe_image
      FROM nobsc_recipes
      WHERE recipe_type_id = ?
      ORDER BY title ASC
      LIMIT ${starting}, ${display}
    `;  // TO DO: change to ? for security
    const [ allRecipesOfType ] = await this.pool.execute(sql, [typeId]);
    return allRecipesOfType;
  }

  async viewRecipesOfTypes(starting, display, placeholders, typeIds) {
    const sql = `
      SELECT recipe_id, title, recipe_image
      FROM nobsc_recipes
      WHERE recipe_type_id IN (${placeholders})
      ORDER BY title ASC
      LIMIT ${starting}, ${display}
    `;  // TO DO: change to ? for security
    const [ allRecipesOfTypes ] = await this.pool.execute(sql, typeIds);
    return allRecipesOfTypes;
  }

  async viewRecipesOfCuisine(starting, display, cuisineId) {
    const sql = `
      SELECT recipe_id, title, recipe_image
      FROM nobsc_recipes
      WHERE cuisine_id = ?
      ORDER BY title ASC
      LIMIT ${starting}, ${display}
    `;  // TO DO: change to ? for security
    const [ allRecipesOfCuisine ] = await this.pool.execute(sql, [cuisineId]);
    return allRecipesOfCuisine;
  }

  async viewRecipesOfCuisines(starting, display, placeholders, cuisineIds) {
    const sql = `
      SELECT recipe_id, title, recipe_image
      FROM nobsc_recipes
      WHERE cuisine_id IN (${placeholders})
      ORDER BY title ASC
      LIMIT ${starting}, ${display}
    `;  // TO DO: change to ? for security
    const [ allRecipesOfCuisines ] = await this.pool.execute(sql, cuisineIds);
    return allRecipesOfCuisines;
  }

  async viewRecipesOfCuisinesAndTypes(starting, display, cuisinePlaceholders, typePlaceholders, ids) {
    const sql = `
      SELECT recipe_id, title, recipe_image
      FROM nobsc_recipes
      WHERE cuisine_id IN (${cuisinePlaceholders}) AND recipe_type_id IN (${typePlaceholders})
      ORDER BY title ASC
      LIMIT ${starting}, ${display}
    `;
    const [ allRecipesOfCuisinesAndTypes ] = await this.pool.execute(sql, ids);
    return allRecipesOfCuisinesAndTypes;
  }

  async viewRecipesOfCuisinesAndType(starting, display, cuisinePlaceholders, ids) {
    const sql = `
      SELECT recipe_id, title, recipe_image
      FROM nobsc_recipes
      WHERE cuisine_id IN (${cuisinePlaceholders}) AND recipe_type_id = ?
      ORDER BY title ASC
      LIMIT ${starting}, ${display}
    `;
    const [ allRecipes ] = await this.pool.execute(sql, ids);
    return allRecipes;
  }

  async viewRecipesOfCuisineAndTypes(starting, display, typePlaceholders, ids) {
    const sql = `
      SELECT recipe_id, title, recipe_image
      FROM nobsc_recipes
      WHERE cuisine_id = ? AND recipe_type_id IN (${typePlaceholders})
      ORDER BY title ASC
      LIMIT ${starting}, ${display}
    `;
    const [ allRecipes ] = await this.pool.execute(sql, ids);
    return allRecipes;
  }

  async viewRecipesOfCuisineAndType(starting, display, ids) {
    const sql = `
      SELECT recipe_id, title, recipe_image
      FROM nobsc_recipes
      WHERE cuisine_id = ? AND recipe_type_id = ?
      ORDER BY title ASC
      LIMIT ${starting}, ${display}
    `;
    const [ allRecipes ] = await this.pool.execute(sql, ids);
    return allRecipes;
  }

  async viewRecipeById(recipeId) {
    const sql = `
      SELECT
        r.recipe_id,
        rt.recipe_type_name,
        c.cuisine_name,
        u.username AS author,
        u.username AS owner,
        r.title,
        r.description,
        r.directions,

        re.amount,
        e.equipment_name,

        ri.amount,
        m.measurement_name AS ingredient_unit,
        e.ingredient_name,

        rs.amount,
        m.measurement_name AS subrecipe_unit,
        r.title AS subtitle,

        r.recipe_image,
        r.equipment_image,
        r.ingredients_image,
        r.cooking_image
      FROM nobsc_recipes r
      INNER JOIN nobsc_recipe_types rt ON rt.recipe_type_id = r.recipe_type_id
      INNER JOIN nobsc_cuisines c ON c.cuisine_id = r.cuisine_id
      INNER JOIN nobsc_users u ON u.user_id = r.author_id
      INNER JOIN nobsc_user u ON u.user_id = r.owner_id

      INNER JOIN nobsc_recipe_equipment re ON re.recipe_id = r.recipe_id
      INNER JOIN nobsc_recipe_equipment re ON re.equipment_id = e.equipment_id

      INNER JOIN nobsc_recipe_ingredients ri ON ri.recipe_id = r.recipe_id
      INNER JOIN nobsc_recipe_ingredients ri ON ri.measurement_id = m.measurement_id
      INNER JOIN nobsc_recipe_ingredients ri ON ri.ingredient_id = i.ingredient_id

      INNER JOIN nobsc_recipe_subrecipes rs ON rs.recipe_id = r.recipe_id
      INNER JOIN nobsc_recipe_subrecipes rs ON rs.measurement_id = m.measurement_id
      INNER JOIN nobsc_recipe_subrecipes rs ON rs.subrecipe_id = r.recipe_id

      WHERE r.recipe_id = ? AND r.owner_id = 1
    `;
    const [ recipe ] = await this.pool.execute(sql, [recipeId]);
    return recipe;
  }

  // YOU CAN REMOVE THIS
  async viewRecipeTitlesByIds(placeholders, recipeIds) {
    const sql = `
      SELECT recipe_id, title
      FROM nobsc_recipes
      WHERE recipe_id IN (${placeholders})
    `;
    const [ recipeTitles ] = await this.pool.execute(sql, recipeIds);
    return recipeTitles;
  }

  async viewRecipesForSubmitEditForm() {
    const sql = `
      SELECT recipe_id, recipe_type_id, cuisine_id, title
      FROM nobsc_recipes
      ORDER BY title ASC
    `;
    const [ allRecipes ] = await this.pool.execute(sql);
    return allRecipes;
  }

  /*
  create, update, and delete methods
  */

  async createRecipe(
    recipeInfo,
    recipeEquipmentPlaceholders,
    recipeIngredientsPlaceholders,
    recipeSubrecipesPlaceholders
  ) {
    const {
      recipeTypeId,
      cuisineId,
      title,
      description,
      directions,
      recipeEquipment,
      recipeIngredients,
      recipeSubrecipes,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage
    } = recipeInfo;

    const sql1 = `
      INSERT INTO nobsc_recipes (
        recipe_type_id,
        cuisine_id,
        author_id,
        owner_id,
        title,
        description,
        directions,
        recipe_image,
        equipment_image,
        ingredients_image,
        cooking_image
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `;
    const [ createdRecipe ] = await this.pool.execute(sql1, [
      recipeTypeId,
      cuisineId,
      title,
      description,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage
    ]);
    const generatedId = createdRecipe.insertId;  // await
    console.log('generatedId: ', generatedId);

    const sql2 = `
      INSERT INTO nobsc_recipe_equipment (recipe_id, equipment_id, amount)
      VALUES ${recipeEquipmentPlaceholders} 
    `;
    let recipeEquipmentParams = [];
    recipeEquipment.map(rE => {
      recipeEquipmentParams.push(generatedId, rE.equipmentId, rE.amount);
    });
    const [ createdRecipeEquipment ] = await this.pool.execute(sql2, recipeEquipmentParams);

    const sql3 = `
      INSERT INTO nobsc_recipe_ingredients (recipe_id, ingredient_id, amount, measurement_id)
      VALUES ${recipeIngredientsPlaceholders}
    `;
    let recipeIngredientsParams = [];
    recipeIngredients.map(rI => {
      recipeIngredientsParams.push(generatedId, rI.ingredientId, rI.amount, rI.measurementId);
    });
    const [ createdRecipeIngredients ] = await this.pool.execute(sql3, recipeIngredientsParams);

    const sql4 = `
      INSERT INTO nobsc_recipe_subrecipes (recipe_id, subrecipe_id, amount, measurement_id)
      VALUES ${recipeSubrecipesPlaceholders}
    `;
    let recipeSubrecipesParams = [];
    recipeSubrecipes.map(rS => {
      recipeSubrecipesParams.push(generatedId, rS.recipeId, rS.amount, rS.measurementId);
    });
    const [ createdRecipeSubrecipes ] = await this.pool.execute(sql4, recipeSubrecipesParams);

    return {
      createdRecipe,
      createdRecipeEquipment,
      createdRecipeIngredients,
      createdRecipeSubrecipes
    };
  }
  
  /*
  you have to make a diffing algorithm for the update
  if anything old is no longer included, you must delete it
  this for the
  nobsc_recipe_equipment
  nobsc_recipe_ingredients
  nobsc_recipe_subrecipes

  1. receive the new as func args
  2. SELECT the old from MySQL
  3. compare the two:
    if
  
  tables
  */
  async updateRecipe(recipeInfo) {
    const {
      recipeTypeId,
      cuisineId,
      title,
      description,
      directions,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      recipeId
    } = recipeInfo;  // way to make id not public?
    const sql = `
      UPDATE nobsc_recipes
      SET
        recipe_type_id = ?,
        cuisine_id = ?,
        title = ?,
        description = ?,
        directions = ?,
        required_equipment = ?,
        required_ingredients = ?,
        required_subrecipes = ?,
        recipe_image = ?,
        equipment_image = ?,
        ingredients_image = ?,
        cooking_image = ?
      WHERE recipe_id = ?
      LIMIT 1
    `;
    const [ updatedRecipe ] = await this.pool.execute(sql, [
      recipeTypeId,
      cuisineId,
      title,
      description,
      directions,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      recipeId
    ]);
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