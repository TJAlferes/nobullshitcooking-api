class UserIngredient {
  constructor(xdevpool) {
    this.xdevpool = xdevpool;
    this.viewUserIngredient = this.viewUserIngredient.bind(this);
    this.viewUserIngredientDetail = this.viewUserIngredientDetail.bind(this);
    this.createUserIngredient = this.createUserIngredient.bind(this);
    this.updateUserIngredient = this.updateUserIngredient.bind(this);
    this.deleteUserIngredient = this.deleteUserIngredient.bind(this);
  }

  
}

module.exports = UserIngredient;