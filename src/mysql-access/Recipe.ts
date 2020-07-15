import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class Recipe implements IRecipe {
  pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.getAllPublicRecipesForElasticSearchBulkInsert =
      this.getAllPublicRecipesForElasticSearchBulkInsert.bind(this);
    this.getPublicRecipeForElasticSearchInsert =
      this.getPublicRecipeForElasticSearchInsert.bind(this);
    this.viewRecipes = this.viewRecipes.bind(this);
    this.viewRecipeById = this.viewRecipeById.bind(this);
    this.createRecipe = this.createRecipe.bind(this);
    this.updateRecipe = this.updateRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.getAllMyPrivateUserRecipeIds =
      this.getAllMyPrivateUserRecipeIds.bind(this);
    this.getInfoToEditMyUserRecipe = this.getInfoToEditMyUserRecipe.bind(this);
    this.updateMyUserRecipe = this.updateMyUserRecipe.bind(this);
    this.deleteMyPrivateUserRecipe = this.deleteMyPrivateUserRecipe.bind(this);
    this.deleteAllMyPrivateUserRecipes =
      this.deleteAllMyPrivateUserRecipes.bind(this);
    this.disownAllMyPublicUserRecipes =
      this.disownAllMyPublicUserRecipes.bind(this);
  }

  async getAllPublicRecipesForElasticSearchBulkInsert() {
    const ownerId = 1;
    const sql = `
      SELECT
        CAST(r.recipe_id AS CHAR) AS recipe_id,
        u.username AS author,
        rt.recipe_type_name,
        c.cuisine_name,
        r.title,
        r.description,
        r.directions,
        r.recipe_image,
        (
          SELECT JSON_ARRAYAGG(m.method_name)
          FROM nobsc_methods m
          INNER JOIN nobsc_recipe_methods rm ON rm.method_id = m.method_id
          WHERE rm.recipe_id = r.recipe_id
        ) method_names,
        (
          SELECT JSON_ARRAYAGG(e.equipment_name)
          FROM nobsc_equipment e
          INNER JOIN nobsc_recipe_equipment re
          ON re.equipment_id = e.equipment_id
          WHERE re.recipe_id = r.recipe_id
        ) equipment_names,
        (
          SELECT JSON_ARRAYAGG(i.ingredient_name)
          FROM nobsc_ingredients i
          INNER JOIN nobsc_recipe_ingredients ri
          ON ri.ingredient_id = i.ingredient_id
          WHERE ri.recipe_id = r.recipe_id
        ) ingredient_names,
        (
          SELECT JSON_ARRAYAGG(r.title)
          FROM nobsc_recipes r
          INNER JOIN nobsc_recipe_subrecipes rs
          ON rs.subrecipe_id = r.recipe_id
          WHERE rs.recipe_id = r.recipe_id
        ) subrecipe_titles
      FROM nobsc_recipes r
      INNER JOIN nobsc_users u ON u.user_id = r.author_id
      INNER JOIN nobsc_recipe_types rt ON rt.recipe_type_id = r.recipe_type_id
      INNER JOIN nobsc_cuisines c ON c.cuisine_id = r.cuisine_id
      WHERE r.owner_id = ?
    `;
    const [ recipes ] = await this.pool
    .execute<RowDataPacket[]>(sql, [ownerId]);
    let final = [];

    for (let recipe of recipes) {
      final.push(
        {index: {_index: 'recipes', _id: recipe.recipe_id}},
        {...recipe}
      );
    }

    return final;
  }

  async getPublicRecipeForElasticSearchInsert(recipeId: number) {
    const ownerId = 1;
    const sql = `
      SELECT
        CAST(r.recipe_id AS CHAR) AS recipe_id,
        u.username AS author,
        rt.recipe_type_name,
        c.cuisine_name,
        r.title,
        r.description,
        r.directions,
        r.recipe_image,
        (
          SELECT JSON_ARRAYAGG(m.method_name)
          FROM nobsc_methods m
          INNER JOIN nobsc_recipe_methods rm ON rm.method_id = m.method_id
          WHERE rm.recipe_id = r.recipe_id
        ) method_names,
        (
          SELECT JSON_ARRAYAGG(e.equipment_name)
          FROM nobsc_equipment e
          INNER JOIN nobsc_recipe_equipment re
          ON re.equipment_id = e.equipment_id
          WHERE re.recipe_id = r.recipe_id
        ) equipment_names,
        (
          SELECT JSON_ARRAYAGG(i.ingredient_name)
          FROM nobsc_ingredients i
          INNER JOIN nobsc_recipe_ingredients ri
          ON ri.ingredient_id = i.ingredient_id
          WHERE ri.recipe_id = r.recipe_id
        ) ingredient_names,
        (
          SELECT JSON_ARRAYAGG(r.title)
          FROM nobsc_recipes r
          INNER JOIN nobsc_recipe_subrecipes rs ON rs.subrecipe_id = r.recipe_id
          WHERE rs.recipe_id = r.recipe_id
        ) subrecipe_titles
      FROM nobsc_recipes r
      INNER JOIN nobsc_users u ON u.user_id = r.author_id
      INNER JOIN nobsc_recipe_types rt ON rt.recipe_type_id = r.recipe_type_id
      INNER JOIN nobsc_cuisines c ON c.cuisine_id = r.cuisine_id
      WHERE r.recipe_id = ? AND r.owner_id = ?
    `;
    const [ recipe ] = await this.pool
    .execute<RowDataPacket[]>(sql, [recipeId, ownerId]);
    return recipe;
  }

  async viewRecipes(authorId: number, ownerId: number) {
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
    const [ recipes ] = await this.pool
    .execute<RowDataPacket[]>(sql, [authorId, ownerId]);
    return recipes;
  }

  async viewRecipeById(recipeId: number, authorId: number, ownerId: number) {
    const sql = `
      SELECT
        r.recipe_id,
        u.username AS author,
        u.avatar AS author_avatar,
        rt.recipe_type_name,
        c.cuisine_name,
        r.title,
        r.description,
        r.active_time,
        r.total_time,
        r.directions,
        r.recipe_image,
        r.equipment_image,
        r.ingredients_image,
        r.cooking_image,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT('method_name', m.method_name))
          FROM nobsc_methods m
          INNER JOIN nobsc_recipe_methods rm ON rm.method_id = m.method_id
          WHERE rm.recipe_id = r.recipe_id
        ) required_methods,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'amount', re.amount,
            'equipment_name', e.equipment_name
          ))
          FROM nobsc_equipment e
          INNER JOIN nobsc_recipe_equipment re ON re.equipment_id = e.equipment_id
          WHERE re.recipe_id = r.recipe_id
        ) required_equipment,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'amount', ri.amount,
            'measurement_name', m.measurement_name,
            'ingredient_name', i.ingredient_name
          ))
          FROM nobsc_ingredients i
          INNER JOIN nobsc_recipe_ingredients ri
          ON ri.ingredient_id = i.ingredient_id
          INNER JOIN nobsc_measurements m ON m.measurement_id = ri.measurement_id
          WHERE ri.recipe_id = r.recipe_id
        ) required_ingredients,
        (
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'amount', rs.amount,
            'measurement_name', m.measurement_name,
            'subrecipe_title', r.title
          ))
          FROM nobsc_recipes r
          INNER JOIN nobsc_recipe_subrecipes rs ON rs.subrecipe_id = r.recipe_id
          INNER JOIN nobsc_measurements m ON m.measurement_id = rs.measurement_id
          WHERE rs.recipe_id = r.recipe_id
        ) required_subrecipes
      FROM nobsc_recipes r
      INNER JOIN nobsc_users u ON u.user_id = r.author_id
      INNER JOIN nobsc_recipe_types rt ON rt.recipe_type_id = r.recipe_type_id
      INNER JOIN nobsc_cuisines c ON c.cuisine_id = r.cuisine_id
      WHERE r.recipe_id = ? AND r.author_id = ? AND r.owner_id = ?
    `;
    const [ recipe ] = await this.pool
    .execute<RowDataPacket[]>(sql, [recipeId, authorId, ownerId]);
    return recipe;
  }

  async createRecipe({
    recipeTypeId,
    cuisineId,
    authorId,
    ownerId,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage
  }: ICreatingRecipe) {
    const sql = `
      INSERT INTO nobsc_recipes (
        recipe_type_id,
        cuisine_id,
        author_id,
        owner_id,
        title,
        description,
        active_time,
        total_time,
        directions,
        recipe_image,
        equipment_image,
        ingredients_image,
        cooking_image
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `;
    const [ createdRecipe ] = await this.pool
    .execute<RowDataPacket[] & ResultSetHeader>(sql, [
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage
    ]);
    return createdRecipe;
  }
  
  async updateRecipe({
    recipeId,
    recipeTypeId,
    cuisineId,
    authorId,
    ownerId,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage
  }: IUpdatingRecipe) {
    const sql = `
      UPDATE nobsc_recipes
      SET
        recipe_type_id = ?,
        cuisine_id = ?,
        author_id = ?,
        owner_id = ?,
        title = ?,
        description = ?,
        active_time = ?,
        total_time = ?,
        directions = ?,
        recipe_image = ?,
        equipment_image = ?,
        ingredients_image = ?,
        cooking_image = ?
      WHERE recipe_id = ?
      LIMIT 1
    `;
    const [ updatedRecipe ] = await this.pool.execute<RowDataPacket[]>(sql, [
      recipeTypeId,
      cuisineId,
      authorId,
      ownerId,
      title,
      description,
      activeTime,
      totalTime,
      directions,
      recipeImage,
      equipmentImage,
      ingredientsImage,
      cookingImage,
      recipeId
    ]);
    return updatedRecipe;
  }
  
  async deleteRecipe(recipeId: number) {
    const sql = `DELETE FROM nobsc_recipes WHERE recipe_id = ? LIMIT 1`;
    const [ deletedRecipe ] = await this.pool
    .execute<RowDataPacket[]>(sql, [recipeId]);
    return deletedRecipe;
  }

  async getInfoToEditMyUserRecipe(
    recipeId: number,
    authorId: number,
    ownerId: number
  ) {
    const sql = `
    SELECT
    r.recipe_id,
    r.recipe_type_id,
    r.cuisine_id,
    r.owner_id,
    r.title,
    r.description,
    r.active_time,
    r.total_time,
    r.directions,
    r.recipe_image,
    r.equipment_image,
    r.ingredients_image,
    r.cooking_image,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT('method_id', rm.method_id))
      FROM nobsc_recipe_methods rm
      WHERE rm.recipe_id = r.recipe_id
    ) required_methods,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount', re.amount,
        'equipment_type_id', e.equipment_type_id,
        'equipment_id', re.equipment_id
      ))
      FROM nobsc_equipment e
      INNER JOIN nobsc_recipe_equipment re ON re.equipment_id = e.equipment_id
      WHERE re.recipe_id = r.recipe_id
    ) required_equipment,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount', ri.amount,
        'measurement_id', ri.measurement_id,
        'ingredient_type_id', i.ingredient_type_id,
        'ingredient_id', ri.ingredient_id
      ))
      FROM nobsc_ingredients i
      INNER JOIN nobsc_recipe_ingredients ri
      ON ri.ingredient_id = i.ingredient_id
      WHERE ri.recipe_id = r.recipe_id
    ) required_ingredients,
    (
      SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'amount', rs.amount,
        'measurement_id', rs.measurement_id,
        'recipe_type_id', r.recipe_type_id,
        'cuisine_id', r.cuisine_id,
        'subrecipe_id', rs.subrecipe_id
      ))
      FROM nobsc_recipes r
      INNER JOIN nobsc_recipe_subrecipes rs ON rs.subrecipe_id = r.recipe_id
      WHERE rs.recipe_id = r.recipe_id
    ) required_subrecipes
    FROM nobsc_recipes r
    INNER JOIN nobsc_users u ON u.user_id = r.author_id
    INNER JOIN nobsc_recipe_types rt ON rt.recipe_type_id = r.recipe_type_id
    INNER JOIN nobsc_cuisines c ON c.cuisine_id = r.cuisine_id
    WHERE r.recipe_id = ? AND r.author_id = ? AND r.owner_id = ?;
    `;
    const [ recipe ] = await this.pool
    .execute<RowDataPacket[]>(sql, [recipeId, authorId, ownerId]);
    return recipe;
  }

  async updateMyUserRecipe({
    recipeId,
    recipeTypeId,
    cuisineId,
    authorId,
    ownerId,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage
  }: IUpdatingRecipe) {
    const sql = `
      UPDATE nobsc_recipes
      SET
        recipe_type_id = ?,
        cuisine_id = ?,
        title = ?,
        description = ?,
        active_time = ?,
        total_time = ?,
        directions = ?,
        recipe_image = ?,
        equipment_image = ?,
        ingredients_image = ?,
        cooking_image = ?
      WHERE recipe_id = ? AND author_id = ? AND owner_id = ?
      LIMIT 1
    `;
    const [ updatedRecipe ] = await this.pool.execute<RowDataPacket[]>(sql, [
      recipeTypeId,
      cuisineId,
      title,
      description,
      activeTime,
      totalTime,
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

  async deleteMyPrivateUserRecipe(
    recipeId: number,
    authorId: number,
    ownerId: number
  ) {
    const sql = `
      DELETE
      FROM nobsc_recipes
      WHERE recipe_id = ? AND author_id = ? AND owner_id = ?
      LIMIT 1
    `;
    const [ deletedPrivateUserRecipe ] = await this.pool
    .execute<RowDataPacket[]>(sql, [
      recipeId,
      authorId,
      ownerId
    ]);
    return deletedPrivateUserRecipe;
  }

  async deleteAllMyPrivateUserRecipes(authorId: number, ownerId: number) {
    const sql = `
      DELETE
      FROM nobsc_recipes
      WHERE author_id = ? AND owner_id = ?
    `;
    await this.pool.execute<RowDataPacket[]>(sql, [authorId, ownerId]);
  }

  async disownMyPublicUserRecipe(recipeId: number, authorId: number) {
    const newAuthorId = 2;
    const sql = `
      UPDATE nobsc_recipes
      SET author_id = ?
      WHERE recipe_id = ? AND author_id = ? AND owner_id = 1
      LIMIT 1
    `;
    const [ disownedPublicUserRecipe ] = await this.pool
    .execute<RowDataPacket[]>(sql, [
      newAuthorId,
      recipeId,
      authorId
    ]);
    return disownedPublicUserRecipe;
  }

  async disownAllMyPublicUserRecipes(authorId: number) {
    const newAuthorId = 2;
    const sql = `
      UPDATE nobsc_recipes
      SET author_id = ?
      WHERE author_id = ? AND owner_id = 1
    `;
    await this.pool.execute<RowDataPacket[]>(sql, [newAuthorId, authorId]);
  }

  async getAllMyPrivateUserRecipeIds(userId: number) {
    const sql = `
      SELECT recipe_id
      FROM nobsc_recipes
      WHERE author_id = ? AND owner_id = ?
    `;
    const [ recipes ] = await this.pool
    .execute<RowDataPacket[]>(sql, [userId, userId]);
    return recipes.map(recipe => recipe.recipe_id);
  }
}

type Data = Promise<RowDataPacket[]>;

type DataWithHeader = Promise<RowDataPacket[] & ResultSetHeader>;

export interface IRecipe {
  pool: Pool;
  getAllPublicRecipesForElasticSearchBulkInsert(): any;
  getPublicRecipeForElasticSearchInsert(recipeId: number): Data;
  viewRecipes(authorId: number, ownerId: number): Data;
  viewRecipeById(recipeId: number, authorId: number, ownerId: number): Data;
  createRecipe({
    recipeTypeId,
    cuisineId,
    authorId,
    ownerId,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage
  }: ICreatingRecipe): DataWithHeader;
  updateRecipe({
    recipeId,
    recipeTypeId,
    cuisineId,
    authorId,
    ownerId,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage
  }: IUpdatingRecipe): Data;
  deleteRecipe(recipeId: number): Data;
  getInfoToEditMyUserRecipe(
    recipeId: number,
    authorId: number,
    ownerId: number
  ): Data;
  updateMyUserRecipe({
    recipeId,
    recipeTypeId,
    cuisineId,
    authorId,
    ownerId,
    title,
    description,
    activeTime,
    totalTime,
    directions,
    recipeImage,
    equipmentImage,
    ingredientsImage,
    cookingImage
  }: IUpdatingRecipe): Data;
  deleteMyPrivateUserRecipe(
    recipeId: number,
    authorId: number,
    ownerId: number
  ): Data;
  disownMyPublicUserRecipe(recipeId: number, authorId: number): Data;
  deleteAllMyPrivateUserRecipes(authorId: number, ownerId: number): void;
  disownAllMyPublicUserRecipes(authorId: number): void;
  getAllMyPrivateUserRecipeIds(userId: number): Promise<number[]>;
}

export interface ICreatingRecipe {
  recipeTypeId: number;
  cuisineId: number;
  authorId: number;
  ownerId: number;
  title: string;
  description: string;
  activeTime: string;
  totalTime: string;
  directions: string;
  recipeImage: string;
  equipmentImage: string;
  ingredientsImage: string;
  cookingImage: string;
}

export interface IUpdatingRecipe extends ICreatingRecipe {
  recipeId: number;
}