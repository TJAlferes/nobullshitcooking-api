class Ingredient {
  constructor(pool) {
    this.pool = pool;

    this.getAllPublicIngredientsForElasticSearchBulkInsert = this.getAllPublicIngredientsForElasticSearchBulkInsert.bind(this);
    this.getIngredientForElasticSearchInsert = this.getIngredientForElasticSearchInsert.bind(this);

    this.viewIngredients = this.viewIngredients.bind(this);
    this.viewIngredientById = this.viewIngredientById.bind(this);
    this.createIngredient = this.createIngredient.bind(this);
    this.updateIngredient = this.updateIngredient.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);

    this.createMyPrivateUserIngredient = this.createMyPrivateUserIngredient.bind(this);
    this.updateMyPrivateUserIngredient = this.updateMyPrivateUserIngredient.bind(this);
    this.deleteMyPrivateUserIngredient = this.deleteMyPrivateUserIngredient.bind(this);
  }

  //--------------------------------------------------------------------------

  async getAllPublicIngredientsForElasticSearchBulkInsert() {
    try {
      const ownerId = 1;
      const sql1 = `
        SELECT
          i.ingredient_id AS ingredient_id,
          i.ingredient_type_id AS ingredient_type_id,
          i.owner_id AS owner_id,
          t.ingredient_type_name AS ingredient_type_name,
          i.ingredient_name AS ingredient_name,
          i.ingredient_description AS ingredient_description,
          i.ingredient_image AS ingredient_image
        FROM nobsc_ingredients i
        INNER JOIN nobsc_ingredient_types it ON it.ingredient_type_id = i.ingredient_type_id
        WHERE i.owner_id = ?
      `;
      const [ ingredientsForBulkInsert ] = await this.pool.execute(sql1, [ownerId]);
      let final = [];
      for (let ingredient of ingredientsForBulkInsert) {  // allows the sequence of awaits we want
        const { ingredient_id } = ingredient;
        final.push(
          {index: {_index: 'ingredients', _id: ingredient_id}},
          ingredient
        );
      }
      return final;
    } catch (err) {
      console.log(err);
    }
  }

  async getIngredientForElasticSearchInsert(ingredientId, ownerId) {
    //const ownerId = 1;
    const sql = `
      SELECT
        i.ingredient_id AS ingredient_id,
        i.ingredient_type_id AS ingredient_type_id,
        i.owner_id AS owner_id,
        t.ingredient_type_name AS ingredient_type_name,
        i.ingredient_name AS ingredient_name,
        i.ingredient_description AS ingredient_description,
        i.ingredient_image AS ingredient_image
      FROM nobsc_ingredients i
      INNER JOIN nobsc_ingredient_types it ON it.ingredient_type_id = e.ingredient_type_id
      WHERE i.ingredient_id = ? i.owner_id = ?
    `;
    const [ ingredientForInsert ] = await this.pool.execute(sql, [
      ingredientId,
      ownerId
    ]);
    /*const { ingredient_id } = ingredientForInsert;
    return [
      {index: {_index: 'ingredient', _id: ingredient_id}},
      ingredientForInsert
    ];*/
    return ingredientForInsert;
  }

  //--------------------------------------------------------------------------

  async viewIngredients(authorId, ownerId) {
    const sql = `
      SELECT
        i.ingredient_id AS ingredient_id,
        i.ingredient_type_id AS ingredient_type_id,
        i.owner_id AS owner_id,
        t.ingredient_type_name AS ingredient_type_name,
        i.ingredient_name AS ingredient_name,
        i.ingredient_description AS ingredient_description,
        i.ingredient_image AS ingredient_image
      FROM nobsc_ingredients
      INNER JOIN nobsc_ingredient_types t ON i.ingredient_type_id = t.ingredient_type_id
      WHERE i.author_id = ? AND i.owner_id = ?
      ORDER BY ingredient_name ASC
    `;
    const [ ingredients ] = await this.pool
    .execute(sql, [authorId, ownerId]);
    return ingredients;
  }

  async viewIngredientById(ingredientId, authorId, ownerId) {
    const sql = `
      SELECT
        i.ingredient_id AS ingredient_id,
        t.ingredient_type_name AS ingredient_type_name
        i.ingredient_name AS ingredient_name,
        i.ingredient_description AS ingredient_description,
        i.ingredient_image AS ingredient_image
      FROM nobsc_ingredients i
      INNER JOIN nobsc_ingredient_types t ON i.ingredient_type_id = t.ingredient_type_id
      WHERE owner_id = 1 AND ingredient_id = ?
    `;
    const [ ingredient ] = await this.pool
    .execute(sql, [ingredientId, authorId, ownerId]);
    return ingredient;
  }

  async createIngredient(ingredientToCreate) {
    const {
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage
    } = ingredientToCreate;
    const sql = `
      INSERT INTO nobsc_ingredients
      (ingredient_type_id, author_id, owner_id, ingredient_name, ingredient_description, ingredient_image)
      VALUES
      (?, ?, ?, ?, ?, ?)
    `;
    const [ createdIngredient ] = await this.pool.execute(sql, [
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage
    ]);
    return createdIngredient;
  }

  async updateIngredient(ingredientToUpdateWith, ingredientId) {
    const { 
      ingredientTypeId,
      ingredientName,
      ingredientDescription,
      ingredientImage
    } = ingredientToUpdateWith;
    const sql = `
      UPDATE nobsc_ingredients
      SET
        ingredient_type_id = ?,
        ingredient_name = ?,
        ingredient_description = ?,
        ingredient_image = ?
      WHERE ingredient_id = ?
      LIMIT 1
    `;
    const [ updatedIngredient ] = await this.pool.execute(sql, [
      ingredientTypeId,
      ingredientName,
      ingredientDescription,
      ingredientImage,
      ingredientId
    ]);
    return updatedIngredient;
  }

  async deleteIngredient(ingredientId) {
    const sql = `
      DELETE
      FROM nobsc_ingredients
      WHERE ingredient_id = ?
      LIMIT 1
    `;
    const [ deletedIngredient ] = await this.pool.execute(sql, [ingredientId]);
    return deletedIngredient;
  }

  //--------------------------------------------------------------------------

  async createMyPrivateUserIngredient(ingredientToCreate) {
    const {
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage
    } = ingredientToCreate;
    const sql = `
      INSERT INTO nobsc_ingredients
      (ingredient_type_id, author_id, owner_id, ingredient_name, ingredient_description, ingredient_image)
      VALUES
      (?, ?, ?, ?, ?, ?)
    `;
    const [ createdPrivateUserIngredient ] = await this.pool.execute(sql, [
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage
    ]);
    return createdPrivateUserIngredient;
  }

  async updateMyPrivateUserIngredient(ingredientToUpdateWith, ingredientId) {
    const {
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage
    } = ingredientToUpdateWith;
    const sql = `
      UPDATE nobsc_ingredients
      SET
        ingredient_type_id = ?,
        author_id = ?,
        owner_id = ?,
        ingredient_name = ?,
        ingredient_description = ?,
        ingredient_image = ?
      WHERE owner_id = ? AND ingredient_id = ?
      LIMIT 1
    `;
    const [ updatedPrivateUserIngredient ] = await this.pool.execute(sql, [
      ingredientTypeId,
      authorId,
      ownerId,
      ingredientName,
      ingredientDescription,
      ingredientImage,
      ownerId,
      ingredientId
    ]);
    return updatedPrivateUserIngredient;
  }

  async deleteMyPrivateUserIngredient(ownerId, ingredientId) {
    const sql = `
      DELETE
      FROM nobsc_ingredients
      WHERE owner_id = ? AND ingredient_id = ?
      LIMIT 1
    `;
    const [ deletedPrivateUserIngredient ] = await this.pool.execute(sql, [ownerId, ingredientId]);
    return deletedPrivateUserIngredient;
  }
}

module.exports = Ingredient;