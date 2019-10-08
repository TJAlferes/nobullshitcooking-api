class Ingredient {
  constructor(pool) {
    this.pool = pool;

    this.getAllPublicIngredientsForElasticSearchBulkInsert = this.getAllPublicIngredientsForElasticSearchBulkInsert.bind(this);

    // public NOBSC ingredients
    this.countAllIngredients = this.countAllIngredients.bind(this);
    this.countIngredientsOfType = this.countIngredientsOfType.bind(this);
    this.countIngredientsOfTypes = this.countIngredientsOfTypes.bind(this);

    this.viewAllIngredients = this.viewAllIngredients.bind(this);
    this.viewIngredientsOfType = this.viewIngredientsOfType.bind(this);
    this.viewIngredientsOfTypes = this.viewIngredientsOfTypes.bind(this);

    this.viewAllOfficialIngredients = this.viewAllOfficialIngredients.bind(this);

    this.viewIngredientById = this.viewIngredientById.bind(this);

    this.createIngredient = this.createIngredient.bind(this);
    this.updateIngredient = this.updateIngredient.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);

    // private user ingredients
    this.viewAllMyPrivateUserIngredients = this.viewAllMyPrivateUserIngredients.bind(this);
    this.viewMyPrivateUserIngredient = this.viewMyPrivateUserIngredient.bind(this);
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
          i.ingredient_id AS ingredientId,
          it.ingredient_type_name AS ingredientTypeName,
          i.ingredient_name AS ingredientName,
          i.ingredient_image AS ingredientImage
        FROM nobsc_ingredients i
        INNER JOIN nobsc_ingredient_types it ON it.ingredient_type_id = i.ingredient_type_id
        WHERE i.owner_id = ?
      `;
      const [ ingredientsForBulkInsert ] = await this.pool.execute(sql1, [ownerId]);
      let final = [];
      for (let ingredient of ingredientsForBulkInsert) {  // allows the sequence of awaits we want
        const { ingredientId } = ingredient;
        final.push(
          {index: {_index: 'ingredients', _id: ingredientId}},
          ingredient
        );
      }
      return final;
    } catch (err) {
      console.log(err);
    }
  }

  //--------------------------------------------------------------------------
  
  /*
  
  public NOBSC ingredients

  */

  async countAllIngredients() {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_ingredients
    `;
    const [ allIngredientsCount ] = await this.pool.execute(sql);
    return allIngredientsCount;
  }

  async countIngredientsOfType(typeId) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_ingredients
      WHERE ingredient_type_id = ?
    `;
    const [ allIngredientsOfTypeCount ] = await this.pool.execute(sql, [typeId]);
    return allIngredientsOfTypeCount;
  }

  async countIngredientsOfTypes(placeholders, typeIds) {  // typeIds must be an array
    const sql = `
      SELECT COUNT(*) AS total
      FROM nobsc_ingredients
      WHERE ingredient_type_id IN (${placeholders})
    `;
    const [ allIngredientsOfTypesCount ] = await this.pool.execute(sql, typeIds);
    return allIngredientsOfTypesCount;
  }

  async viewAllIngredients(starting, display) {
    const sql = `
      SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
      FROM nobsc_ingredients
      ORDER BY ingredient_name ASC
      LIMIT ?, ?
    `;
    const [ allIngredients ] = await this.pool.execute(sql, [starting, display]);
    return allIngredients;
  }

  async viewIngredientsOfType(starting, display, typeId) {
    const sql = `
      SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
      FROM nobsc_ingredients
      WHERE ingredient_type_id = ?
      ORDER BY ingredient_name ASC
      LIMIT ?, ?
    `;
    const [ allIngredientsOfType ] = await this.pool.execute(sql, [typeId, starting, display]);
    return allIngredientsOfType;
  }

  async viewIngredientsOfTypes(starting, display, placeholders, typeIds) {  // typeIds must be an array
    const sql = `
      SELECT ingredient_id, ingredient_name, ingredient_type_id, ingredient_image
      FROM nobsc_ingredients
      WHERE ingredient_type_id IN (${placeholders})
      ORDER BY ingredient_name ASC
      LIMIT ${starting}, ${display}
    `;  // TO DO: change to ? for security 
    const [ allIngredientsOfTypes ] = await this.pool.execute(sql, typeIds);
    return allIngredientsOfTypes;
  }

  async viewAllOfficialIngredients() {
    const sql = `
      SELECT ingredient_id, ingredient_type_id, ingredient_name, ingredient_image
      FROM nobsc_ingredients
      WHERE owner_id = 1
    `;
    const [ allOfficialIngredients ] = await this.pool.execute(sql);
    return allOfficialIngredients;
  }

  async viewIngredientById(ingredientId) {
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
    const [ ingredient ] = await this.pool.execute(sql, [ingredientId]);
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



  /*

  private user ingredients

  */

  async viewAllMyPrivateUserIngredients(ownerId) {
    const sql = `
      SELECT ingredient_id, ingredient_name, ingredient_image
      FROM nobsc_ingredients
      WHERE owner_id = ?
      ORDER BY ingredient_name ASC
    `;
    const [ allMyPrivateUserIngredients ] = await this.pool.execute(sql, [ownerId]);
    return allMyPrivateUserIngredients;
  }

  async viewMyPrivateUserIngredient(ownerId, ingredientId) {
    const sql = `
      SELECT
        i.ingredient_id AS ingredient_id,
        t.ingredient_type_name AS ingredient_type_name
        i.ingredient_name AS ingredient_name,
        i.ingredient_description AS ingredient_description,
        i.ingredient_image AS ingredient_image
      FROM nobsc_ingredients i
      INNER JOIN nobsc_ingredient_types t ON i.ingredient_type_id = t.ingredient_type_id
      WHERE owner_id = ? AND ingredient_id = ?
    `;
    const [ myPrivateUserIngredient ] = await this.pool.execute(sql, [ownerId, ingredientId]);
    return myPrivateUserIngredient;
  }

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