class Recipe {
  constructor(pool) {
    this.pool = pool;

    this.getAllPublicRecipesForElasticSearchBulkInsert = this.getAllPublicRecipesForElasticSearchBulkInsert.bind(this);
    
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

    this.viewAllOfficialRecipes = this.viewAllOfficialRecipes.bind(this);
    this.viewAllPublicRecipes = this.viewAllPublicRecipes.bind(this);

    this.viewRecipeById = this.viewRecipeById.bind(this);
    //this.viewRecipeTitlesByIds = this.viewRecipeTitlesByIds.bind(this);
    this.viewRecipesForSubmitEditForm = this.viewRecipesForSubmitEditForm.bind(this);

    this.createRecipe = this.createRecipe.bind(this);

    this.updateRecipe = this.updateRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);

    this.viewAllMyPrivateUserRecipes = this.viewAllMyPrivateUserRecipes.bind(this);
    this.viewAllMyPublicUserRecipes = this.viewAllMyPublicUserRecipes.bind(this);
    this.viewMyPrivateUserRecipe = this.viewMyPrivateUserRecipe.bind(this);
    this.viewMyPublicUserRecipe = this.viewMyPublicUserRecipe.bind(this);

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
          r.description AS recipeDescription,
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
      // why the usual this.pool.execute() method isn't working... who knows...
      // possibly the way it hooks into events? we're outside of normal routes flow here
      // see source code and/or ask
      // .promise().query()
      const [ recipesForBulkInsert ] = await this.pool.execute(sql1, [ownerId]);

      // given relational database, maybe there is a better way, maybe there isn't
      // perhaps some sort of denormalization?
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
          {
            index: {
              _index: 'recipes',
              _id: recipeId,
              //_type: 'recipe'
            }
          },
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

      //console.log(final);
      return final;
    } catch (err) {
      console.log(err);
    }
  }

  //--------------------------------------------------------------------------

  async countAllRecipes() {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE owner_id = 1
    `;
    const [ allRecipesCount ] = await this.pool.execute(sql);
    return allRecipesCount;
  }

  async countRecipesOfType(typeId) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE recipe_type_id = ? AND owner_id = 1
    `;
    const [ allRecipesOfTypeCount ] = await this.pool.execute(sql, [typeId]);
    return allRecipesOfTypeCount;
  }

  async countRecipesOfTypes(placeholders, typeIds) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE recipe_type_id IN (${placeholders}) AND owner_id = 1
    `;
    const [ allRecipesOfTypesCount ] = await this.pool.execute(sql, typeIds);
    return allRecipesOfTypesCount;
  }

  async countRecipesOfCuisine(cuisineId) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE cuisine_id = ? AND owner_id = 1
    `;
    const [ allRecipesOfCuisineCount ] = await this.pool.execute(sql, [cuisineId]);
    return allRecipesOfCuisineCount;
  }

  async countRecipesOfCuisines(placeholders, cuisineIds) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE cuisine_id IN (${placeholders}) AND owner_id = 1
    `;
    const [ allRecipesOfCuisinesCount ] = await this.pool.execute(sql, cuisineIds);
    return allRecipesOfCuisinesCount;
  }

  async countRecipesOfCuisinesAndTypes(cuisinePlaceholders, typePlaceholders, ids) {
    const sql=`
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE
        cuisine_id IN (${cuisinePlaceholders})
        AND recipe_type_id IN (${typePlaceholders})
        AND owner_id = 1
    `;
    const [ allRecipesOfCuisinesAndTypesCount ] = await this.pool.execute(sql, ids);
    return allRecipesOfCuisinesAndTypesCount;
  }

  async countRecipesOfCuisinesAndType(cuisinePlaceholders, ids) {
    const sql=`
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE cuisine_id IN (${cuisinePlaceholders}) AND owner_id = 1
    `;
    const [ allRecipesOfCuisinesAndTypeCount ] = await this.pool.execute(sql, ids);
    return allRecipesOfCuisinesAndTypeCount;
  }

  async countRecipesOfCuisineAndTypes(typePlaceholders, ids) {
    const sql=`
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE
        cuisine_id = ?
        AND recipe_type_id IN (${typePlaceholders})
        AND owner_id = 1
    `;
    const [ allRecipesOfCuisineAndTypesCount ] = await this.pool.execute(sql, ids);
    return allRecipesOfCuisineAndTypesCount;
  }

  async countRecipesOfCuisineAndType(ids) {
    const sql=`
      SELECT COUNT(*) AS total
      FROM nobsc_recipes
      WHERE cuisine_id = ? AND recipe_type_id = ? AND owner_id = 1
    `;
    const [ allRecipesOfCuisineAndTypeCount ] = await this.pool.execute(sql, ids);
    return allRecipesOfCuisineAndTypeCount;
  }

  //--------------------------------------------------------------------------

  async viewAllRecipes(starting, display) {
    const sql = `
      SELECT recipe_id, title, recipe_image
      FROM nobsc_recipes
      WHERE owner_id = 1
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
      WHERE recipe_type_id = ? AND owner_id = 1
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
      WHERE recipe_type_id IN (${placeholders}) AND owner_id = 1
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
      WHERE cuisine_id = ? AND owner_id = 1
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
      WHERE cuisine_id IN (${placeholders}) AND owner_id = 1
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
      WHERE
        cuisine_id IN (${cuisinePlaceholders})
        AND recipe_type_id IN (${typePlaceholders})
        AND owner_id = 1
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
      WHERE
        cuisine_id IN (${cuisinePlaceholders})
        AND recipe_type_id = ?
        AND owner_id = 1
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
      WHERE
        cuisine_id = ?
        AND recipe_type_id IN (${typePlaceholders})
        AND owner_id = 1
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
      WHERE cuisine_id = ? AND recipe_type_id = ? AND owner_id = 1
      ORDER BY title ASC
      LIMIT ${starting}, ${display}
    `;
    const [ allRecipes ] = await this.pool.execute(sql, ids);
    return allRecipes;
  }

  async viewAllOfficialRecipes() {
    const sql = `
      SELECT recipe_id, recipe_type_id, cuisine_id, title, recipe_image
      FROM nobsc_recipes
      WHERE author_id = 1 AND owner_id = 1
    `;
    const [ allOfficialRecipes ] = await this.pool.execute(sql);
    return allOfficialRecipes;
  }

  async viewAllPublicRecipes() {  // WILL GET BIG!
    const sql = `
      SELECT recipe_id, recipe_type_id, cuisine_id, title, recipe_image
      FROM nobsc_recipes
      WHERE author_id != 1 AND owner_id = 1
    `;
    const [ allPublicRecipes ] = await this.pool.execute(sql);
    return allPublicRecipes;
  }

  async viewRecipeById(recipeId) {
    try {
      const ownerId = 1;

      // get main info
      const sql1 = `
        SELECT
          r.recipe_id AS recipeId,
          u.username AS authorName,
          rt.recipe_type_name AS recipeTypeName,
          c.cuisine_name AS cuisineName,
          r.title AS title,
          r.description AS description,
          r.directions AS directions,
          r.recipe_image AS recipeImage,
          r.equipment_image AS recipeEquipmentImage,
          r.ingredients_image AS recipeIngredientsImage,
          r.cooking_image AS recipeCookingImage,
        FROM nobsc_recipes r
        INNER JOIN nobsc_users u ON u.user_id = r.author_id
        INNER JOIN nobsc_recipe_types rt ON rt.recipe_type_id = r.recipe_type_id
        INNER JOIN nobsc_cuisines c ON c.cuisine_id = r.cuisine_id
        WHERE r.recipe_id = ? AND r.owner_id = ?
      `;

      // get methods
      const sql2 = `
        SELECT m.method_name AS methodName
        FROM nobsc_methods m
        INNER JOIN nobsc_recipe_methods rm ON rm.method_id = m.method_id
        WHERE rm.recipe_id = ?
      `;

      // get equipment and their respective amounts
      const sql3 = `
        SELECT
          re.amount AS amount,
          e.equipment_name AS equipmentName
        FROM nobsc_equipment e
        INNER JOIN nobsc_recipe_equipment re ON re.equipment_id = e.equipment_id
        WHERE re.recipe_id = ?
      `;

      // get ingredients and their respective amounts and measurements
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

      // get subrecipes and their respective amounts and measurements
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

      const [ recipe ] = await this.pool.execute(sql1, [recipeId, ownerId]);
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

      //console.log(final);
      return final;
    } catch (err) {
      console.log(err);
    }
  }

  // YOU CAN REMOVE THIS
  /*async viewRecipeTitlesByIds(placeholders, recipeIds) {
    const sql = `
      SELECT recipe_id, title
      FROM nobsc_recipes
      WHERE recipe_id IN (${placeholders})
    `;
    const [ recipeTitles ] = await this.pool.execute(sql, recipeIds);
    return recipeTitles;
  }*/

  async viewRecipesForSubmitEditForm() {
    const sql = `
      SELECT recipe_id, recipe_type_id, cuisine_id, title
      FROM nobsc_recipes
      ORDER BY title ASC
    `;
    const [ allRecipes ] = await this.pool.execute(sql);
    return allRecipes;
  }

  //--------------------------------------------------------------------------

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

  //--------------------------------------------------------------------------
  
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

  async viewAllMyPrivateUserRecipes(ownerId) {
    const sql = `
      SELECT recipe_id, title, recipe_image
      FROM nobsc_recipes
      WHERE owner_id = ?
      ORDER BY title ASC
    `;
    const [ allMyPrivateUserRecipes ] = await this.pool.execute(sql, [ownerId]);
    return allMyPrivateUserRecipes;
  }

  async viewAllMyPublicUserRecipes(authorId, ownerId) {
    const sql = `
      SELECT recipe_id, title, recipe_image
      FROM nobsc_recipes
      WHERE author_id = ? AND owner_id = ?
      ORDER BY title ASC
    `;
    const [ allMyPublicUserRecipes ] = await this.pool.execute(sql, [authorId, ownerId]);
    return allMyPublicUserRecipes;
  }

  async viewMyPrivateUserRecipe(recipeId, ownerId) {
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
        md.method_name,
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
      INNER JOIN nobsc_recipe_methods rmd ON rmd.recipe_id = r.recipe_id
      INNER JOIN nobsc_recipe_methods rmd ON rmd.method_id = md.method_id 
      INNER JOIN nobsc_recipe_equipment re ON re.recipe_id = r.recipe_id
      INNER JOIN nobsc_recipe_equipment re ON re.equipment_id = e.equipment_id
      INNER JOIN nobsc_recipe_ingredients ri ON ri.recipe_id = r.recipe_id
      INNER JOIN nobsc_recipe_ingredients ri ON ri.measurement_id = m.measurement_id
      INNER JOIN nobsc_recipe_ingredients ri ON ri.ingredient_id = i.ingredient_id
      INNER JOIN nobsc_recipe_subrecipes rs ON rs.recipe_id = r.recipe_id
      INNER JOIN nobsc_recipe_subrecipes rs ON rs.measurement_id = m.measurement_id
      INNER JOIN nobsc_recipe_subrecipes rs ON rs.subrecipe_id = r.recipe_id
      WHERE r.recipe_id = ? AND r.owner_id = ?
    `;
    const [ myPrivateUserRecipe ] = await this.pool.execute(sql, [
      recipeId,
      ownerId
    ]);
    return myPrivateUserRecipe;
  }

  async viewMyPublicUserRecipe(recipeId, authorId, ownerId) {
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
        md.method_name,
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
      INNER JOIN nobsc_recipe_methods rmd ON rmd.recipe_id = r.recipe_id
      INNER JOIN nobsc_recipe_methods rmd ON rmd.method_id = md.method_id 
      INNER JOIN nobsc_recipe_equipment re ON re.recipe_id = r.recipe_id
      INNER JOIN nobsc_recipe_equipment re ON re.equipment_id = e.equipment_id
      INNER JOIN nobsc_recipe_ingredients ri ON ri.recipe_id = r.recipe_id
      INNER JOIN nobsc_recipe_ingredients ri ON ri.measurement_id = m.measurement_id
      INNER JOIN nobsc_recipe_ingredients ri ON ri.ingredient_id = i.ingredient_id
      INNER JOIN nobsc_recipe_subrecipes rs ON rs.recipe_id = r.recipe_id
      INNER JOIN nobsc_recipe_subrecipes rs ON rs.measurement_id = m.measurement_id
      INNER JOIN nobsc_recipe_subrecipes rs ON rs.subrecipe_id = r.recipe_id
      WHERE r.recipe_id = ? AND r.author_id = ? AND r.owner_id = ?
    `;
    const [ myPublicUserRecipe ] = await this.pool.execute(sql, [
      recipeId,
      authorId,
      ownerId
    ]);
    return myPublicUserRecipe;
  }



  async getInfoToEditMyUserRecipe(recipeId, authorId, ownerId) {
    const sql1 = `
      SELECT
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
      WHERE recipe_id = ? AND author_id = ?
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