class Ingredient {
  constructor(pool) {
    this.pool = pool;
    this.countAllIngredients = this.countAllIngredients.bind(this);
    this.countIngredientsOfType = this.countIngredientsOfType.bind(this);
    this.countIngredientsOfTypes = this.countIngredientsOfTypes.bind(this);
    this.viewAllIngredients = this.viewAllIngredients.bind(this);
    this.viewIngredientsOfType = this.viewIngredientsOfType.bind(this);
    this.viewIngredientsOfTypes = this.viewIngredientsOfTypes.bind(this);
    this.viewIngredientById = this.viewIngredientById.bind(this);
    this.viewIngredientsForSubmitEditForm = viewIngredientsForSubmitEditForm.bind(this);
    this.createIngredient = this.createIngredient.bind(this);
    this.updateIngredient = this.updateIngredient.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);

    this.viewAllMyPrivateUserIngredients = this.viewAllMyPrivateUserIngredients.bind(this);
    this.viewMyPrivateUserIngredient = this.viewMyPrivateUserIngredient.bind(this);
    this.createMyPrivateUserIngredient = this.createMyPrivateUserIngredient.bind(this);
    this.updateMyPrivateUserIngredient = this.updateMyPrivateUserIngredient.bind(this);
    this.deleteMyPrivateUserIngredient = this.deleteMyPrivateUserIngredient.bind(this);
  }

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
      LIMIT ${starting}, ${display}
    `;  // TO DO: change to ? for security
    const [ allIngredientsOfType ] = await this.pool.execute(sql, [typeId]);
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

  async viewIngredientById(ingredientId) {
    const sql = `
      SELECT
        i.ingredient_id AS ingredient_id,
        i.ingredient_name AS ingredient_name,
        i.ingredient_type_id AS ingredient_type,
        i.ingredient_image AS ingredient_image,
        t.ingredient_type_name AS ingredient_type_name
      FROM nobsc_ingredient_types t
      LEFT JOIN nobsc_ingredients i ON i.ingredient_type_id = t.ingredient_type_id
      WHERE ingredient_id = ?
    `;  // CHANGE TO INNER JOIN, look at all others too
    const [ ingredient ] = await this.pool.execute(sql, [ingredientId]);
    return ingredient;
  }

  async viewIngredientsForSubmitEditForm() {
    const sql = `
      SELECT ingredient_id, ingredient_type_id, ingredient_name
      FROM nobsc_ingredients
      ORDER BY ingredient_name ASC
    `;
    const [ allIngredients ] = await this.pool.execute(sql);
    return allIngredients;
  }

  async createIngredient(ingredientInfo) {
    const { id, name, typeId, image } = ingredientInfo;
    const sql = `
      INSERT INTO nobsc_ingredients
      (ingredient_id, ingredient_name, ingredient_type_id, ingredient_image)
      VALUES
      (?, ?, ?, ?)
    `;
    const [ createdIngredient ] = await this.pool.execute(sql, [id, name, typeId, image]);
    return createdIngredient;
  }

  async updateIngredient(ingredientInfo) {
    const { id, name, typeId, image } = ingredientInfo;
    const sql = `
      UPDATE nobsc_ingredients
      SET ingredient_name = ?, ingredient_type_id = ?, ingredient_image = ?
      WHERE ingredient_id = ?
      LIMIT 1
    `;
    const [ updatedIngredient ] = await this.pool.execute(sql, [name, typeId, image, id]);
    return updatedIngredient;
  }

  async deleteIngredient(ingredientId) {
    const sql = `
      DELETE
      FROM nobsc_ingredients
      WHERE ingredient_id = ?
      LIMIT 1
    `;
    const [ edIngredient ] = await this.pool.execute(sql, [ingredientId]);
    return deletedIngredient;
  }



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