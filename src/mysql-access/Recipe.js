class Recipe {
  constructor(pool) {
    this.pool = pool;

    this.getAllPublicRecipesForElasticSearchBulkInsert = this.getAllPublicRecipesForElasticSearchBulkInsert.bind(this);
    this.getPublicRecipeForElasticSearchInsert = this.getPublicRecipeForElasticSearchInsert.bind(this);

    this.viewRecipes = this.viewRecipes.bind(this);
    this.viewRecipeById = this.viewRecipeById.bind(this);
    this.createRecipe = this.createRecipe.bind(this);
    this.updateRecipe = this.updateRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);

    this.getInfoToEditMyUserRecipe = this.getInfoToEditMyUserRecipe.bind(this);
    this.updateMyUserRecipe = this.updateMyUserRecipe.bind(this);
    this.deleteMyPrivateUserRecipe = this.deleteMyPrivateUserRecipe.bind(this);
    this.disownMyPublicUserRecipe = this.disownMyPublicUserRecipe.bind(this);
  }

  async getAllPublicRecipesForElasticSearchBulkInsert() {
    const ownerId = 1;
    const sql1 = `
      SELECT
        r.recipe_id,
        u.username AS author,
        rt.recipe_type_name,
        c.cuisine_name,
        r.title,
        r.description,
        r.directions,
        r.recipe_image
      FROM nobsc_recipes r
      INNER JOIN nobsc_users u ON u.user_id = r.author_id
      INNER JOIN nobsc_recipe_types rt ON rt.recipe_type_id = r.recipe_type_id
      INNER JOIN nobsc_cuisines c ON c.cuisine_id = r.cuisine_id
      WHERE r.owner_id = ?
    `;
    const sql2 = `
      SELECT m.method_name
      FROM nobsc_methods m
      INNER JOIN nobsc_recipe_methods rm ON rm.method_id = m.method_id
      WHERE rm.recipe_id = ?
    `;
    const sql3 = `
      SELECT e.equipment_name
      FROM nobsc_equipment e
      INNER JOIN nobsc_recipe_equipment re ON re.equipment_id = e.equipment_id
      WHERE re.recipe_id = ?
    `;
    const sql4 = `
      SELECT i.ingredient_name
      FROM nobsc_ingredients i
      INNER JOIN nobsc_recipe_ingredients ri ON ri.ingredient_id = i.ingredient_id
      WHERE ri.recipe_id = ?
    `;
    const sql5 = `
      SELECT r.title AS subrecipe_title
      FROM nobsc_recipes r
      INNER JOIN nobsc_recipe_subrecipes rs ON rs.subrecipe_id = r.recipe_id
      WHERE rs.recipe_id = ?
    `;
    const [ recipesForBulkInsert ] = await this.pool.execute(sql1, [ownerId]);
    let final = [];
    for (let recipe of recipesForBulkInsert) {
      const { recipeId } = recipe;
      const [ methodNames ] = await this.pool.execute(sql2, [recipeId]);
      const [ equipmentNames ] = await this.pool.execute(sql3, [recipeId]);
      const [ ingredientNames ] = await this.pool.execute(sql4, [recipeId]);
      const [ subrecipeTitles ] = await this.pool.execute(sql5, [recipeId]);
      let method_names = [];
      let equipment_names = [];
      let ingredient_names = [];
      let subrecipe_titles = [];
      methodNames.forEach(met => method_names.push(met.method_name));
      equipmentNames.forEach(equ => equipment_names.push(equ.equipment_name));
      ingredientNames.forEach(ing => ingredient_names.push(ing.ingredient_name));
      subrecipeTitles.forEach(sub => subrecipe_titles.push(sub.subrecipe_title));
      final.push(
        {index: {_index: 'recipes', _id: recipeId}},
        {
          ...recipe,
          method_names,
          equipment_names,
          ingredient_names,
          subrecipe_titles
        }
      );
    }
    return final;
  }

  async getPublicRecipeForElasticSearchInsert(recipeId) {
    const ownerId = 1;
    const sql1 = `
      SELECT
        r.recipe_id,
        u.username AS author,
        rt.recipe_type_name,
        c.cuisine_name,
        r.title,
        r.description,
        r.directions,
        r.recipe_image
      FROM nobsc_recipes r
      INNER JOIN nobsc_users u ON u.user_id = r.author_id
      INNER JOIN nobsc_recipe_types rt ON rt.recipe_type_id = r.recipe_type_id
      INNER JOIN nobsc_cuisines c ON c.cuisine_id = r.cuisine_id
      WHERE r.recipe_id = ? AND r.owner_id = ?
    `;
    const sql2 = `
      SELECT m.method_name
      FROM nobsc_methods m
      INNER JOIN nobsc_recipe_methods rm ON rm.method_id = m.method_id
      WHERE rm.recipe_id = ?
    `;
    const sql3 = `
      SELECT e.equipment_name
      FROM nobsc_equipment e
      INNER JOIN nobsc_recipe_equipment re ON re.equipment_id = e.equipment_id
      WHERE re.recipe_id = ?
    `;
    const sql4 = `
      SELECT i.ingredient_name
      FROM nobsc_ingredients i
      INNER JOIN nobsc_recipe_ingredients ri ON ri.ingredient_id = i.ingredient_id
      WHERE ri.recipe_id = ?
    `;
    const sql5 = `
      SELECT r.title AS subrecipe_title
      FROM nobsc_recipes r
      INNER JOIN nobsc_recipe_subrecipes rs ON rs.subrecipe_id = r.recipe_id
      WHERE rs.recipe_id = ?
    `;
    const [ recipeForInsert ] = await this.pool
    .execute(sql1, [recipeId, ownerId]);
    const [ recipeForInsertDestructured ] = recipeForInsert;
    const [ methodNames ] = await this.pool.execute(sql2, [recipeId]);
    const [ equipmentNames ] = await this.pool.execute(sql3, [recipeId]);
    const [ ingredientNames ] = await this.pool.execute(sql4, [recipeId]);
    const [ subrecipeTitles ] = await this.pool.execute(sql5, [recipeId]);
    let method_names = [];
    let equipment_names = [];
    let ingredient_names = [];
    let subrecipe_titles = [];
    methodNames.forEach(met => method_names.push(met.method_name));
    equipmentNames.forEach(equ => equipment_names.push(equ.equipment_name));
    ingredientNames.forEach(ing => ingredient_names.push(ing.ingredient_name));
    subrecipeTitles.forEach(sub => subrecipe_titles.push(sub.subrecipe_title));
    return {
      ...recipeForInsertDestructured,
      method_names,
      equipment_names,
      ingredient_names,
      subrecipe_titles
    };
  }

  //--------------------------------------------------------------------------

  async viewRecipes(authorId, ownerId) {
    const sql = `
      SELECT
        recipe_id,
        recipe_type_id,
        cuisine_id,
        title,
        recipe_image,
        owner_id
      FROM nobsc_recipes
      WHERE author_id = ? AND owner_id = ?
      ORDER BY title ASC
    `;
    const [ recipes ] = await this.pool.execute(sql, [authorId, ownerId]);
    return recipes;
  }

  async viewRecipeById(recipeId, authorId, ownerId) {
    const sql1 = `
      SELECT
        r.recipe_id
        u.username AS author,
        u.avatar AS author_avatar,
        rt.recipe_type_name,
        c.cuisine_name,
        r.title AS title,
        r.description AS description,
        r.directions AS directions,
        r.recipe_image,
        r.equipment_image,
        r.ingredients_image,
        r.cooking_image
      FROM nobsc_recipes r
      INNER JOIN nobsc_users u ON u.user_id = r.author_id
      INNER JOIN nobsc_recipe_types rt ON rt.recipe_type_id = r.recipe_type_id
      INNER JOIN nobsc_cuisines c ON c.cuisine_id = r.cuisine_id
      WHERE r.recipe_id = ? AND r.author_id = ? AND r.owner_id = ?
    `;
    const sql2 = `
      SELECT m.method_name
      FROM nobsc_methods m
      INNER JOIN nobsc_recipe_methods rm ON rm.method_id = m.method_id
      WHERE rm.recipe_id = ?
    `;
    const sql3 = `
      SELECT
        re.amount AS amount,
        e.equipment_name
      FROM nobsc_equipment e
      INNER JOIN nobsc_recipe_equipment re ON re.equipment_id = e.equipment_id
      WHERE re.recipe_id = ?
    `;
    const sql4 = `
      SELECT
        i.ingredient_name,
        ri.amount AS amount,
        m.measurement_name
      FROM nobsc_ingredients i
      INNER JOIN nobsc_recipe_ingredients ri ON ri.ingredient_id = i.ingredient_id
      INNER JOIN nobsc_measurements m ON ri.measurement_id = m.measurement_id
      WHERE ri.recipe_id = ?
    `;
    const sql5 = `
      SELECT
        r.title AS subrecipe_title,
        rs.amount AS amount,
        m.measurement_name
      FROM nobsc_recipes r
      INNER JOIN nobsc_recipe_subrecipes rs ON rs.subrecipe_id = r.recipe_id
      INNER JOIN nobsc_measurements m ON rs.measurement_id = m.measurement_id
      WHERE rs.recipe_id = ?
    `; 
    const [ recipe ] = await this.pool
    .execute(sql1, [recipeId, authorId, ownerId]);
    const [ recipeDestructured ] = recipe;
    const [ required_methods ] = await this.pool.execute(sql2, [recipeId]);
    const [ required_equipment ] = await this.pool.execute(sql3, [recipeId]);
    const [ required_ingredients ] = await this.pool.execute(sql4, [recipeId]);
    const [ required_subrecipes ] = await this.pool.execute(sql5, [recipeId]);
    return {
      ...recipeDestructured,
      required_methods,
      required_equipment,
      required_ingredients,
      required_subrecipes
    };
  }

  async createRecipe(recipeToCreate) {
    const {
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
      title,
      description,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage
    } = recipeToCreate;
    const sql = `
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
    const [ createdRecipe ] = await this.pool.execute(sql, [
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
      title,
      description,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage
    ]);
    return createdRecipe;
  }
  
  async updateRecipe(recipeToUpdateWith, recipeId) {
    const {
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
      title,
      description,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
    } = recipeToUpdateWith;
    const sql = `
      UPDATE nobsc_recipes
      SET
        recipe_type_id = ?,
        cuisine_id = ?,
        author_id = ?,
        owner_id = ?,
        title = ?,
        description = ?,
        directions = ?,
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
      authorId,
      ownerId,
      title,
      description,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      recipeId
    ]);
    return updatedRecipe;
  }
  
  async deleteRecipe(recipeId) {
    const sql = `DELETE FROM nobsc_recipes WHERE recipe_id = ? LIMIT 1`;
    const [ deletedRecipe ] = await this.pool.execute(sql, [recipeId]);
    return deletedRecipe;
  }

  //--------------------------------------------------------------------------

  async getInfoToEditMyUserRecipe(recipeId, authorId, ownerId) {
    const sql1 = `
      SELECT
        r.recipe_id,
        r.recipe_type_id,
        r.cuisine_id,
        r.owner_id,
        r.title,
        r.description,
        r.directions,
        r.recipe_image,
        r.equipment_image,
        r.ingredients_image,
        r.cooking_image
      FROM nobsc_recipes r
      WHERE r.recipe_id = ? AND r.author_id = ? AND r.owner_id = ?
    `;
    const sql2 = `
      SELECT method_id
      FROM nobsc_recipe_methods
      WHERE recipe_id = ?
    `;
    const sql3 = `
      SELECT
        re.amount,
        e.equipment_type_id,
        re.equipment_id
      FROM nobsc_equipment e
      INNER JOIN nobsc_recipe_equipment re ON re.equipment_id = e.equipment_id
      WHERE re.recipe_id = ?
    `;
    const sql4 = `
      SELECT
        ri.amount,
        ri.measurement_id,
        i.ingredient_type_id,
        ri.ingredient_id
      FROM nobsc_ingredients i
      INNER JOIN nobsc_recipe_ingredients ri ON ri.ingredient_id = i.ingredient_id
      WHERE ri.recipe_id = ?
    `;
    const sql5 = `
      SELECT
        rs.amount AS amount,
        rs.measurement_id,
        r.recipe_type_id,
        r.cuisine_id,
        rs.subrecipe_id
      FROM nobsc_recipes r
      INNER JOIN nobsc_recipe_subrecipes rs ON rs.subrecipe_id = r.recipe_id
      WHERE rs.recipe_id = ?
    `;
    const [ recipe ] = await this.pool
    .execute(sql1, [recipeId, authorId, ownerId]);
    const [ recipeDestructured ] = recipe;
    const [ requiredMethods ] = await this.pool.execute(sql2, [recipeId]);
    const [ requiredEquipment ] = await this.pool.execute(sql3, [recipeId]);
    const [ requiredIngredients ] = await this.pool.execute(sql4, [recipeId]);
    const [ requiredSubrecipes ] = await this.pool.execute(sql5, [recipeId]);
    return {
      ...recipeDestructured,
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes
    };
  }

  async updateMyUserRecipe(recipeToUpdateWith, recipeId) {
    const {
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
      title,
      description,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
    } = recipeToUpdateWith;
    const sql = `
      UPDATE nobsc_recipes
      SET
        recipe_type_id = ?,
        cuisine_id = ?,
        title = ?,
        description = ?,
        directions = ?,
        recipe_image = ?,
        equipment_image = ?,
        ingredients_image = ?,
        cooking_image = ?
      WHERE recipe_id = ? AND author_id = ? AND owner_id = ?
      LIMIT 1
    `;
    const [ updatedRecipe ] = await this.pool.execute(sql, [
      recipeTypeId,
      cuisineId,
      title,
      description,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      recipeId,
      authorId,
      ownerId
    ]);
    return updatedRecipe;
  }

  async deleteMyPrivateUserRecipe(recipeId, authorId, ownerId) {
    const sql = `
      DELETE
      FROM nobsc_recipes
      WHERE recipe_id = ? AND author_id = ? AND owner_id = ?
      LIMIT 1
    `;
    const [ deletedPrivateUserRecipe ] = await this.pool.execute(sql, [
      recipeId,
      authorId,
      ownerId
    ]);
    return deletedPrivateUserRecipe;
  }

  async disownMyPublicUserRecipe(newAuthorId, recipeId, authorId) {
    const sql = `
      UPDATE nobsc_recipes
      SET author_id = ?
      WHERE recipe_id = ? AND author_id = ? AND owner_id = 1
      LIMIT 1
    `;
    const [ disownedPublicUserRecipe ] = await this.pool.execute(sql, [
      newAuthorId,
      recipeId,
      authorId
    ]);
    return disownedPublicUserRecipe;
  }
}

module.exports = Recipe;