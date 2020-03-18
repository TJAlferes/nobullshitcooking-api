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
  
  //--------------------------------------------------------------------------

  async getAllPublicRecipesForElasticSearchBulkInsert() {
    try {
      const ownerId = 1;
      const sql1 = `
        SELECT
          r.recipe_id AS recipeId,
          u.username AS authorName,
          rt.recipe_type_name AS recipeTypeName,
          c.cuisine_name AS cuisineName,
          r.title AS title,
          r.description AS description,
          r.directions AS directions,
          r.recipe_image AS recipeImage
        FROM nobsc_recipes r
        INNER JOIN nobsc_users u ON u.user_id = r.author_id
        INNER JOIN nobsc_recipe_types rt ON rt.recipe_type_id = r.recipe_type_id
        INNER JOIN nobsc_cuisines c ON c.cuisine_id = r.cuisine_id
        WHERE r.owner_id = ?
      `;
      const sql2 = `
        SELECT m.method_name AS methodName
        FROM nobsc_methods m
        INNER JOIN nobsc_recipe_methods rm ON rm.method_id = m.method_id
        WHERE rm.recipe_id = ?
      `;
      const sql3 = `
        SELECT e.equipment_name AS equipmentName
        FROM nobsc_equipment e
        INNER JOIN nobsc_recipe_equipment re ON re.equipment_id = e.equipment_id
        WHERE re.recipe_id = ?
      `;
      const sql4 = `
        SELECT i.ingredient_name AS ingredientName
        FROM nobsc_ingredients i
        INNER JOIN nobsc_recipe_ingredients ri ON ri.ingredient_id = i.ingredient_id
        WHERE ri.recipe_id = ?
      `;
      const sql5 = `
        SELECT r.title AS subrecipeTitle
        FROM nobsc_recipes r
        INNER JOIN nobsc_recipe_subrecipes rs ON rs.subrecipe_id = r.recipe_id
        WHERE rs.recipe_id = ?
      `;

      //.promise().query()
      const [ recipesForBulkInsert ] = await this.pool.execute(sql1, [ownerId]);

      //const poolRef = this.pool;
      let final = [];

      for (let recipe of recipesForBulkInsert) {  // allows the sequence of awaits we want
        const { recipeId } = recipe;
        let usedMethods = [];
        let usedEquipment = [];
        let usedIngredients = [];
        let usedSubrecipes = [];

        // remember to account for one or multiple
        const [ methodNames ] = await this.pool.execute(sql2, [recipeId]);
        const [ equipmentNames ] = await this.pool.execute(sql3, [recipeId]);
        const [ ingredientNames ] = await this.pool.execute(sql4, [recipeId]);
        const [ subrecipeTitles ] = await this.pool.execute(sql5, [recipeId]);

        methodNames.forEach(met => usedMethods.push(met.methodName));
        equipmentNames.forEach(equ => usedEquipment.push(equ.equipmentName));
        ingredientNames.forEach(ing => usedIngredients.push(ing.ingredientName));
        subrecipeTitles.forEach(sub => usedSubrecipes.push(sub.subrecipeTitle));

        final.push(
          {index: {_index: 'recipes', _id: recipeId}},
          {
            ...recipe,
            ...{
              methodNames: usedMethods,
              equipmentNames: usedEquipment,
              ingredientNames: usedIngredients,
              subrecipeNames: usedSubrecipes
            }
          }
        );
      }

      return final;
    } catch (err) {
      console.log(err);
    }
  }

  async getPublicRecipeForElasticSearchInsert(recipeId) {
    try {
      const ownerId = 1;
      const sql1 = `
        SELECT
          r.recipe_id AS recipeId,
          u.username AS authorName,
          rt.recipe_type_name AS recipeTypeName,
          c.cuisine_name AS cuisineName,
          r.title AS title,
          r.description AS description,
          r.directions AS directions,
          r.recipe_image AS recipeImage
        FROM nobsc_recipes r
        INNER JOIN nobsc_users u ON u.user_id = r.author_id
        INNER JOIN nobsc_recipe_types rt ON rt.recipe_type_id = r.recipe_type_id
        INNER JOIN nobsc_cuisines c ON c.cuisine_id = r.cuisine_id
        WHERE r.recipe_id = ? AND r.owner_id = ?
      `;
      const sql2 = `
        SELECT m.method_name AS methodName
        FROM nobsc_methods m
        INNER JOIN nobsc_recipe_methods rm ON rm.method_id = m.method_id
        WHERE rm.recipe_id = ?
      `;
      const sql3 = `
        SELECT e.equipment_name AS equipmentName
        FROM nobsc_equipment e
        INNER JOIN nobsc_recipe_equipment re ON re.equipment_id = e.equipment_id
        WHERE re.recipe_id = ?
      `;
      const sql4 = `
        SELECT i.ingredient_name AS ingredientName
        FROM nobsc_ingredients i
        INNER JOIN nobsc_recipe_ingredients ri ON ri.ingredient_id = i.ingredient_id
        WHERE ri.recipe_id = ?
      `;
      const sql5 = `
        SELECT r.title AS subrecipeTitle
        FROM nobsc_recipes r
        INNER JOIN nobsc_recipe_subrecipes rs ON rs.subrecipe_id = r.recipe_id
        WHERE rs.recipe_id = ?
      `;

      const [ recipeForInsert ] = await this.pool.execute(sql1, [recipeId, ownerId]);

      // remember to account for one or multiple
      const [ methodNames ] = await this.pool.execute(sql2, [recipeId]);
      const [ equipmentNames ] = await this.pool.execute(sql3, [recipeId]);
      const [ ingredientNames ] = await this.pool.execute(sql4, [recipeId]);
      const [ subrecipeTitles ] = await this.pool.execute(sql5, [recipeId]);

      let usedMethods = [];
      let usedEquipment = [];
      let usedIngredients = [];
      let usedSubrecipes = [];
      methodNames.forEach(met => usedMethods.push(met.methodName));
      equipmentNames.forEach(equ => usedEquipment.push(equ.equipmentName));
      ingredientNames.forEach(ing => usedIngredients.push(ing.ingredientName));
      subrecipeTitles.forEach(sub => usedSubrecipes.push(sub.subrecipeTitle));

      const [ recipeForInsertDestructured ] = recipeForInsert;
      const final = {
        ...{...recipeForInsertDestructured},
        ...{
          methodNames: usedMethods,
          equipmentNames: usedEquipment,
          ingredientNames: usedIngredients,
          subrecipeNames: usedSubrecipes
        }
      };

      return final; 
    } catch (err) {
      console.log(err);
    }
  }

  //--------------------------------------------------------------------------

  async viewRecipes(authorId, ownerId) {
    const sql = `
      SELECT recipe_id, recipe_type_id, cuisine_id, title, recipe_image, owner_id
      FROM nobsc_recipes
      WHERE author_id = ? AND owner_id = ?
      ORDER BY title ASC
    `;
    const [ recipes ] = await this.pool.execute(sql, [authorId, ownerId]);
    return recipes;
  }

  async viewRecipeById(recipeId, authorId, ownerId) {
    try {
      const sql1 = `
        SELECT
          r.recipe_id AS recipeId,
          u.username AS authorName,
          u.avatar AS authorAvatar,
          rt.recipe_type_name AS recipeTypeName,
          c.cuisine_name AS cuisineName,
          r.title AS title,
          r.description AS description,
          r.directions AS directions,
          r.recipe_image AS recipeImage,
          r.equipment_image AS recipeEquipmentImage,
          r.ingredients_image AS recipeIngredientsImage,
          r.cooking_image AS recipeCookingImage
        FROM nobsc_recipes r
        INNER JOIN nobsc_users u ON u.user_id = r.author_id
        INNER JOIN nobsc_recipe_types rt ON rt.recipe_type_id = r.recipe_type_id
        INNER JOIN nobsc_cuisines c ON c.cuisine_id = r.cuisine_id
        WHERE r.recipe_id = ? AND r.author_id = ? AND r.owner_id = ?
      `;
      const sql2 = `
        SELECT m.method_name AS methodName
        FROM nobsc_methods m
        INNER JOIN nobsc_recipe_methods rm ON rm.method_id = m.method_id
        WHERE rm.recipe_id = ?
      `;
      const sql3 = `
        SELECT
          re.amount AS amount,
          e.equipment_name AS equipmentName
        FROM nobsc_equipment e
        INNER JOIN nobsc_recipe_equipment re ON re.equipment_id = e.equipment_id
        WHERE re.recipe_id = ?
      `;
      const sql4 = `
        SELECT
          i.ingredient_name AS ingredientName,
          ri.amount AS amount,
          m.measurement_name AS measurementName
        FROM nobsc_ingredients i
        INNER JOIN nobsc_recipe_ingredients ri ON ri.ingredient_id = i.ingredient_id
        INNER JOIN nobsc_measurements m ON ri.measurement_id = m.measurement_id
        WHERE ri.recipe_id = ?
      `;
      const sql5 = `
        SELECT
          r.title AS subrecipeTitle,
          rs.amount AS amount,
          m.measurement_name AS measurementName
        FROM nobsc_recipes r
        INNER JOIN nobsc_recipe_subrecipes rs ON rs.subrecipe_id = r.recipe_id
        INNER JOIN nobsc_measurements m ON rs.measurement_id = m.measurement_id
        WHERE rs.recipe_id = ?
      `; 

      const [ recipe ] = await this.pool.execute(sql1, [recipeId, authorId, ownerId]);
      // remember to account for one or multiple
      const [ requiredMethods ] = await this.pool.execute(sql2, [recipeId]);
      const [ requiredEquipment ] = await this.pool.execute(sql3, [recipeId]);
      const [ requiredIngredients ] = await this.pool.execute(sql4, [recipeId]);
      const [ requiredSubrecipes ] = await this.pool.execute(sql5, [recipeId]);

      let final = {
        recipe,
        ...{
          requiredMethods,
          requiredEquipment,
          requiredIngredients,
          requiredSubrecipes
        }
      };

      return final;
    } catch (err) {
      console.log(err);
    }
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
    const sql = `
      DELETE
      FROM nobsc_recipes
      WHERE recipe_id = ?
      LIMIT 1
    `;
    const [ deletedRecipe ] = await this.pool.execute(sql, [recipeId]);
    return deletedRecipe;
  }

  //--------------------------------------------------------------------------

  async getInfoToEditMyUserRecipe(recipeId, authorId, ownerId) {
    const sql1 = `
      SELECT
        r.recipe_id AS recipeId,
        r.recipe_type_id AS recipeTypeId,
        r.cuisine_id AS cuisineId,
        r.owner_id AS ownerId,
        r.title AS title,
        r.description AS description,
        r.directions AS directions,
        r.recipe_image AS recipeImage,
        r.equipment_image AS recipeEquipmentImage,
        r.ingredients_image AS recipeIngredientsImage,
        r.cooking_image AS recipeCookingImage
      FROM nobsc_recipes r
      WHERE r.recipe_id = ? AND r.author_id = ? AND r.owner_id = ?
    `;
    const sql2 = `
      SELECT method_id AS methodId
      FROM nobsc_recipe_methods
      WHERE recipe_id = ?
    `;
    const sql3 = `
      SELECT
        re.amount AS amount,
        e.equipment_type_id AS equipmentTypeId,
        re.equipment_id AS equipmentId
      FROM nobsc_equipment e
      INNER JOIN nobsc_recipe_equipment re ON re.equipment_id = e.equipment_id
      WHERE re.recipe_id = ?
    `;
    const sql4 = `
      SELECT
        ri.amount AS amount,
        ri.measurement_id AS measurementId,
        i.ingredient_type_id AS ingredientTypeId,
        ri.ingredient_id AS ingredientId
      FROM nobsc_ingredients i
      INNER JOIN nobsc_recipe_ingredients ri ON ri.ingredient_id = i.ingredient_id
      WHERE ri.recipe_id = ?
    `;
    const sql5 = `
      SELECT
        rs.amount AS amount,
        rs.measurement_id AS measurementId,
        r.recipe_type_id AS recipeTypeId,
        r.cuisine_id AS cuisineId,
        rs.subrecipe_id AS subrecipeId
      FROM nobsc_recipes r
      INNER JOIN nobsc_recipe_subrecipes rs ON rs.subrecipe_id = r.recipe_id
      WHERE rs.recipe_id = ?
    `;
    
    const [ recipe ] = await this.pool.execute(sql1, [recipeId, authorId, ownerId]);
    // remember to account for one or multiple
    const [ requiredMethods ] = await this.pool.execute(sql2, [recipeId]);
    const [ requiredEquipment ] = await this.pool.execute(sql3, [recipeId]);
    const [ requiredIngredients ] = await this.pool.execute(sql4, [recipeId]);
    const [ requiredSubrecipes ] = await this.pool.execute(sql5, [recipeId]);
    
    let final = {
      recipe: recipe[0],
      requiredMethods,
      requiredEquipment,
      requiredIngredients,
      requiredSubrecipes
    };
    
    return final;
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