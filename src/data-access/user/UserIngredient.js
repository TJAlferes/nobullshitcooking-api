class UserIngredient {
  constructor(pool) {
    //this.xdevpool = xdevpool;  // Not using yet, if ever for this
    this.pool = pool;
    this.viewUserIngredient = this.viewUserIngredient.bind(this);
    this.viewUserIngredientDetail = this.viewUserIngredientDetail.bind(this);
    this.createUserIngredient = this.createUserIngredient.bind(this);
    this.updateUserIngredient = this.updateUserIngredient.bind(this);
    this.deleteUserIngredient = this.deleteUserIngredient.bind(this);
  }

  async viewUserIngredient(userId) {
    const sql = `
      SELECT ingredient_type_id, ingredient_name, ingredient_image, ingredient_description
      FROM nobsc_ingredients
      WHERE owner_id = ?
    `;
  }

  async viewUserIngredientDetail(userId, ingredientId) {
    const sql = `
      SELECT ingredient_type_id, ingredient_name, ingredient_image, ingredient_description
      FROM nobsc_ingredients
      WHERE owner_id = ? AND ingredient_id = ?
    `;
  }

  async createUserIngredient(ownerId, ingredientInfo) {
    const sql = `
    INSERT INTO nobsc_ingredients
    (ingredient_id, ingredient_name, ingredient_type_id, ingredient_image)
    VALUES
    (?, ?, ?, ?)
    `;
  }

  async updateUserIngredient(ownerId, ingredientInfo) {
    const sql = `
      
    `;
  }

  async deleteUserIngredient(ownerId) {
    const sql = `
      
    `;
  }
}

module.exports = UserIngredient;